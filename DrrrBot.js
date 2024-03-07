
const puppeteer = require('puppeteer');
const request   = require('request');
const fs        = require('fs');
const Queue     = require('queue');

const header = `

  ██████╗ ██████╗ ██████╗ ██████╗ ██████╗  ██████╗ ████████╗
  ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝
  ██║  ██║██████╔╝██████╔╝██████╔╝██████╔╝██║   ██║   ██║   
  ██║  ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║   ██║   ██║   
  ██████╔╝██║  ██║██║  ██║██║  ██║██████╔╝╚██████╔╝   ██║   
  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝    ╚═╝   
`;

let event_n = 0;

class Event {
  constructor(e) {
    this.is_inital = event_n++ === 0;
    this.has_talks = !!e.talks;
    this.has_users = !!e.users;
    this.talks     = e.talks||[];
    this.users     = e.users||[];
  }
}

class Talk {
  constructor(talk) {
    this.time = talk.time;
    this.id   = talk.id;
    this.uid  = talk.from && talk.from.id ? talk.from.id : 'thefuckuid';
    this.type = talk.type;
    this.talk = talk;
    this.tripcode = talk.from && talk.from.tripcode ? talk.from.tripcode : '';

    this.name = talk.from && talk.from.name ? talk.from.name : talk.user ? talk.user.name : 'thefuckname';
    this.msg  = talk.type === 'message' || talk.type === 'leave'
      ? talk.message
      : talk.type === 'me'
        ? talk.content.trim()
        : 'thefucdismsg';
  }
}

class DrrrBot {
  constructor(opts = {}) {
    this.CONFIG_PATH = 'app/config.json';
    this.HOST        = 'https://drrr.com/room';
    this.API_URL     = this.HOST + '/?ajax=1';
    this.COOKIE_NAME = 'drrr-session-1';

    this.MOD = ['pls', 'throw', 'help', 'gif', 'translate', 'question', 'spam', 'kick', 'die', 'mitsuku', 'joke', 'numbers', 'advice', 'ship', 'pokefusion', 'discord'];
    this.REQ_RIGHTS = {
      pls: 1, plss: 1, throw: 1, help: 1, h: 1, gif: 1, g: 1, translate: 1, question: 1, q: 1, t: 1, s: 1, die: 1, tell: 1,
      kick: 0, ban: 0, giverights: 0, chuckJoke: 1, geekJoke: 1, number: 1, year: 1, advice: 1, ship:1, pokefusion: 1, report: 1, discord: 1
    };

    this.mod = {};
    this.init_mod();

    this.FLAGS = {
      printc: false
    };

    this.config = this.read_config();
    this.users = {};
    this.talks = [];

    this.q = Queue();
    this.q.concurrency = 1; // Number of jobs which can be processed at once
    this.q.timeout     = 3000;
    this.q.autostart   = true;

    this.already_banned = {};

    // For puppeteer
    this.cookie = {
      url   : this.HOST,
      name  : this.COOKIE_NAME,
      value : this.config.cookie
    };

    // For request
    const jar = request.jar();
    jar.setCookie(
      request.cookie( this.cookie.name+'='+this.cookie.value ),
      this.HOST
    );

    this.request = request.defaults({ jar });
  }
  
  async init() {
    this.init_t = new Date().getTime();

    await this.create_page();
    await this.connect();
    await this.catch_events();
    await this.keep_connection();

    console.log(header);
    console.log();
  }

  load_mod(name) {
    const mod = require(`./mod/${name}.js`);
    this.mod[name] = new mod.default(this);
  }

  init_mod() {
    try {
      this.MOD.forEach( name => this.load_mod(name) );
    }
    catch(err) {
      throw err;
    }
  }

  reload_mod(name) {
    delete require.cache[ require.resolve(`./mod/${name}.js`) ];
    this.load_mod(name);

    console.log(this.mod[name]);
  }

  // Initializate puppeteer
  async create_page() {
    this.browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    this.page    = await this.browser.newPage();
  }

  async connect() {
    await this.page.setCookie(this.cookie);
    await this.page.goto(this.HOST);
  }

  async keep_connection() {
    // Work magic here
  }

  read_config() {
    return JSON.parse( fs.readFileSync( this.CONFIG_PATH, 'utf8' ) );
  }
  write_config() {
    return fs.writeFileSync( this.CONFIG_PATH, JSON.stringify(this.config) );
  }

  // Take a screenshot
  async screenshot() {
    await this.page.screenshot({ path: 'app/pics/test.png' });
  }

  // Hooks the response events to the event handler
  async catch_events() {
    await this.page.on('response', async res => {
      const text = await res.text();
      
      try {
        const json = JSON.parse(text);
        this.event_handler( new Event(json) );
      }
      catch(err) {
        //console.error( Error('Couldn\'t parse response:') );
        //console.log(text);
      }
    });
  }

  async post(json) {
    this.request.post({
      url  : this.API_URL,
      form : json
    });
  }

  async message(text) {
    await this.post({ message: text });
  }

  async message_URL(message, url) {
    await this.post({
      message: message,
      url: url
    });
  }

  async me(line) {
    await this.message('/me ' + line);
  }

  //Kick
  async kick(id) {
    console.log("Kick ID: " + id); 
    await this.post({ kick: id });
  } 
  
  //Ban
  async ban(id) {
    console.log("Ban ID: " + id); 
    await this.post({ ban: id });
  }

  //Ban and Report
  async banAndReport(id) {
    console.log("Report and Ban ID: " + id); 
    await this.post({ report_and_ban_user: id });
  }

  async share(url, name) {
    console.log(`Sharing "${url}" "${name}"`);
    await this.message(`/share ${url} ${name}`);
  }

  async user_autoban(user) {
    if( this.config.banned.names[user.name.toLowerCase()] ) {
      //await this.kick(user.id);
    }
  }
  
  async talk_autoban(talk) {
    if(this.config.banned.words.length && talk.type === 'message' || talk.type === 'me') {
      this.config.banned.words.forEach( async word => {
        if( talk.msg.toLowerCase().includes(word.toLowerCase()) ) {
          //await this.kick(talk.uid);
        }
      });
    }
  }

  async spam_check_fast() {
    const scores = {};

    for(let i = 0; i < 10; i++) {
      const talk1 = this.talks[this.talks.length-i-1];
      const talk2 = this.talks[this.talks.length-i-2];

      if( talk1.time - talk2.time < 1 && talk1.uid === talk2.uid ) {
        scores[talk1.uid] = (scores[talk1.uid]||0) + 1;
      }
    }

    Object.keys(scores).filter( uid => scores[uid] > 5 & !this.already_banned[uid] )
      .forEach( async uid => {
        console.log('SPAM: TOO FAST');

        this.already_banned[uid] = true;
        await this.ban(uid);

        setTimeout( () => this.already_banned[uid] = false, 10000 );
      });
  }

  async spam_check_same() {
    const scores = {};

    for(let i = 0; i < 10; i++) {
      const talk1 = this.talks[this.talks.length-i-1];
      const talk2 = this.talks[this.talks.length-i-2];

      if( talk1.msg === talk2.msg && talk1.uid === talk2.uid ) {
        scores[talk1.uid] = (scores[talk1.uid]||0) + 1;
      }
    }

    Object.keys(scores).filter( uid => scores[uid] > 5 && !this.already_banned[uid] )
      .forEach( async uid => {
        console.log('SPAM: SAME');

        this.already_banned[uid] = true;
        await this.ban(uid);

        setTimeout( () => this.already_banned[uid] = false, 10000 );
      });
  }

  async check_spam() {
    if( this.talks.length > 10 ) {
      await this.spam_check_fast();
      await this.spam_check_same();
    }
  }

  // Dispatch events into its respective handlers
  event_handler(e) {
    if(e.has_users) {
      e.users.forEach( user => this.user_handler(user, e) );
    }
    if(e.has_talks) {
      e.talks.forEach( talk => this.talk_handler(talk, e) );
      this.check_spam();
    }
  }

  user_handler(user, e) {
    this.users[user.id] = user;
    this.user_autoban(user);
  }

  talk_handler(talk, e) {
    const _talk = new Talk(talk);
    this.talks.push(_talk);
    
    if(!e.is_initial && _talk.type === 'message' && _talk.msg[0] === '!')
      this.user_cmd_handler(_talk.msg.substr(1), _talk);
    if(this.FLAGS.printc)
      this.print_talk(_talk);

    this.talk_autoban(_talk);
  }

  user_cmd_handler(str, talk) {
    const parts = str.split(/\s+/);
    const cmd   = parts[0];
    const args  = parts.slice(1).join(' ');

    const t = new Date().getTime();
    const rights = this.config.rights[talk.tripcode] === undefined
      ? 1
      : this.config.rights[talk.tripcode];

    console.log(`Command ${cmd} ${talk.name}, req ${this.REQ_RIGHTS[cmd]}, rights ${rights}`);

    if(
      this.q.length < 10
      && t - this.init_t > 5000
      && this.REQ_RIGHTS[cmd] !== undefined
      && rights <= this.REQ_RIGHTS[cmd]
    ) {
      let f;

      switch(cmd) {
        case 'pls':
          f = () => this.mod.pls.share_yt(args);
          break;
        case 'plss':
          f = () => this.mod.pls.search_yt(args);
          break;
        case 'gif':
          f = () => this.mod.gif.run(args);
          break; 
        case 'help':
          f = () => this.mod.help.run(args);
          break;
        case 't':
        case 'translate':
          f = () => this.mod.translate.translate(args);
          break;
        case 's':
          f = () => this.mod.translate.s(args);
          break;
        case 'throw':
          f = () => this.mod.throw.run(talk);
          break;
        case 'kick':
          f = () => this.mod.kick.kick(args);
          break;
        case 'ban':
          f = () => this.mod.kick.ban(args);
          break;
        case 'giverights':
          f = () => this.mod.kick.giverights(args);
          break;
        case 'q':
        case 'question':
          f = () => this.mod.question.run(args, talk);
          break;
        case 'tell':
          f = () => this.mod.mitsuku.input(args);
          break;
          case 'chuckJoke':
          f = () => this.mod.joke.chuckJoke(args);
          break;
        case 'geekJoke':
          f = () => this.mod.joke.geekJoke(args);
        break;
        case 'number':
          f = () => this.mod.numbers.number(args);
          break;
        case 'year':
          f = () => this.mod.numbers.year(args);
          break;
        case 'advice':
          f = () => this.mod.advice.advice(args);
          break;
        case 'ship':
          f = () => this.mod.ship.ship(args);
          break;
        case 'pokefusion':
          f = () => this.mod.pokefusion.fusion(args);
          break;
        case 'die':
          f = () => this.mod.die.die();
          break;
        case 'report':
          f = () => this.mod.discord.report(args, talk.name, talk.talk.from.icon);
          break;
        case 'discord':
          f = () => this.mod.help.discord();
          break;
      }

      if(f) {
        this.q.push(f);
      }
    }
  }

  // Trims a string and expands it with whitespace
  trimpad(str, len) {
    return str.substr(0, len).padEnd(len, ' ');
  }

  print_talk(talk) {
    //console.log('TALK', talk);

    // Just in case. Idk if this is neccesary
    const name     = talk.name;
    const tripcode = talk.from && talk.from.tripcode ? ` #${talk.from.tripcode}` : '';
    const id       = talk.uid || 'whoid';

    const date = new Date(0);
    date.setUTCSeconds(talk.time);

    const time = [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map( n => n.toString().padStart(2, '0') )
      .join(':');

    const user_line = `  [${time}] ${this.trimpad(name, 18)}${this.trimpad(tripcode, 12)} (${this.trimpad(id, 10)})`;

    switch(talk.type) {
      case 'message':
        console.log(`${user_line}: ${talk.msg}`);
        break;
      case 'me':
        console.log(`${user_line}: * ${talk.msg} *`);
        break;
      case 'join':
        console.log(`${user_line}  Has connected.`)
        break;
      case 'leave':
        console.log(`${user_line}  Has ${talk.msg.includes('timeout') ? 'timed out' : 'disconnected'}.`);
        break;
      case 'kick':
        console.log(`${user_line}  Has been kicked.`);
        break;
      case 'roll':
        'Nah';
        break;
      case 'async-response':
        console.log('You have been banned.');
        break;
      case 'music':
        console.log(`${user_line}  Playing ${talk.music ? talk.music.name : 'thefuccmusic'} ${talk.music.url}`);
        break;
      default:
        console.log('Unknown talk', talk);
    }
  }
}

module.exports = { DrrrBot };

