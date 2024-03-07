DROP TABLE character CASCADE CONSTRAINTS;
DROP TABLE team CASCADE CONSTRAINTS;
DROP TABLE media CASCADE CONSTRAINTS;
DROP TABLE superpower CASCADE CONSTRAINTS;
DROP TABLE ls_ln CASCADE CONSTRAINTS;
DROP TABLE character_alias CASCADE CONSTRAINTS;
DROP TABLE team_alias CASCADE CONSTRAINTS;
DROP TABLE powerstats CASCADE CONSTRAINTS;
DROP TABLE appearance CASCADE CONSTRAINTS;
DROP TABLE leader_of CASCADE CONSTRAINTS;
DROP TABLE appears_in CASCADE CONSTRAINTS;
DROP TABLE uses CASCADE CONSTRAINTS;
DROP TABLE seen_in CASCADE CONSTRAINTS;
DROP TABLE alternate_character CASCADE CONSTRAINTS;
DROP TABLE team_leader CASCADE CONSTRAINTS;


CREATE TABLE character
(Name VARCHAR2(15),
 Alignment VARCHAR2(10),
 Creator VARCHAR2(10),
 Place_of_birth VARCHAR2(10),
 Occupation VARCHAR2(10),
 Base VARCHAR2(10), 
 CONSTRAINT character_pk PRIMARY KEY(Name)
 );


CREATE TABLE team
(Team_name VARCHAR2(20),
 Creator VARCHAR2(10),
 CONSTRAINT team_pk PRIMARY KEY(Team_name)
 );

CREATE TABLE media
(Media_name VARCHAR2(10),
 Media_type VARCHAR2(10),
 CONSTRAINT media_pk PRIMARY KEY(Media_name)
 );

CREATE TABLE superpower
(Power_name VARCHAR2(10),
 Power_bonus NUMBER(6),
 CONSTRAINT superpower_pk PRIMARY KEY(Power_name)
 );

CREATE TABLE is_in
(T_name VARCHAR2(20),
 M_name VARCHAR2(10),
 CONSTRAINT is_in_pk PRIMARY KEY(T_name, M_name)
 );

CREATE TABLE character_alias
(Char_name VARCHAR2(20),
 Char_alias VARCHAR2(100),
 CONSTRAINT character_alias_pk PRIMARY KEY(Char_name, Char_alias)
 );

CREATE TABLE team_alias
(T_name VARCHAR2(20),
 T_alias VARCHAR2(100),
 CONSTRAINT team_alias_pk PRIMARY KEY(T_name, T_alias)
 );


CREATE TABLE powerstats
(Char_name VARCHAR2(20),
 Power VARCHAR2(40),
 Strength NUMBER(3),
 Durability NUMBER(3),
 Speed NUMBER(3),
 Combat NUMBER(3),
 Intelligence NUMBER(3),
 CONSTRAINT powerstats_pk PRIMARY KEY(Char_name)
 );


CREATE TABLE appearance
(Char_name VARCHAR2(20),
 Costume_name VARCHAR2(40),
 Height CHAR(3),
 Eye_color  VARCHAR2(5),
 Hair_color  VARCHAR2(5),
 Race VARCHAR2(10),
 Gender VARCHAR2(10),
 Weight NUMBER(3),
 CONSTRAINT appearance_pk PRIMARY KEY(Char_name, Costume_name)
 );

CREATE TABLE leader_of
(C_name VARCHAR2(20),
 T_name VARCHAR2(20),
 CONSTRAINT leader_of_pk PRIMARY KEY(C_name, T_name)
 );

CREATE TABLE appears_in
(Char_name VARCHAR2(20),
 Med_name VARCHAR2(20),
 CONSTRAINT appears_in_pk PRIMARY KEY(Char_name, Med_name)
 );

CREATE TABLE uses
(C_name VARCHAR2(20),
 Pow_name VARCHAR2(20),
 CONSTRAINT uses_pk PRIMARY KEY(C_name, Pow_name)
 );

CREATE TABLE seen_in
(P_name VARCHAR2(20),
 M_name VARCHAR2(50),
 CONSTRAINT seen_in_pk PRIMARY KEY(P_name, M_name)
 );

CREATE TABLE alternate_character
(Char_name VARCHAR2(20),
 Alter_ego VARCHAR2(100),
 CONSTRAINT alternate_character_pk PRIMARY KEY(Char_name, Alter_ego)
 );

CREATE TABLE team_leader
(T_name VARCHAR2(20),
 T_leader VARCHAR2(20),
 CONSTRAINT team_leader_pk PRIMARY KEY(T_name, T_leader) 
 );

ALTER TABLE powerstats
ADD CONSTRAINT powerstats_char_name_fk FOREIGN KEY(Char_name)
REFERENCES character(Name);


ALTER TABLE team_alias
ADD CONSTRAINT team_alias_t_name_fk FOREIGN KEY(T_name)
REFERENCES character(Name);

ALTER TABLE character_alias
ADD CONSTRAINT character_alias_char_name_fk FOREIGN KEY(Char_name)
REFERENCES character(Name);


ALTER TABLE is_in
ADD CONSTRAINT is_in_t_name_fk FOREIGN KEY(T_name)
REFERENCES team(Team_name);


ALTER TABLE is_in
ADD CONSTRAINT is_in_m_name_fk FOREIGN KEY(M_name)
REFERENCES media(Media_name);

ALTER TABLE appearance
ADD CONSTRAINT appearance_char_name_fk FOREIGN KEY(Char_name)
REFERENCES character(Name);

ALTER TABLE alternate_character
ADD CONSTRAINT alternate_char_name_fk FOREIGN KEY(Char_name)
REFERENCES character(Name);


ALTER TABLE seen_in
ADD CONSTRAINT seen_in_p_name_fk FOREIGN KEY(P_name)
REFERENCES superpower(Power_name);

ALTER TABLE uses
ADD CONSTRAINT uses_c_name_fk FOREIGN KEY(C_name)
REFERENCES character(Name);

ALTER TABLE appears_in
ADD CONSTRAINT appears_in_char_name_fk FOREIGN KEY(Char_name)
REFERENCES character(Name);

ALTER TABLE appears_in
ADD CONSTRAINT appears_in_med_name_fk FOREIGN KEY(Med_name)
REFERENCES media(Media_name);

ALTER TABLE leader_of
ADD CONSTRAINT leader_of_c_name_fk FOREIGN KEY(C_name)
REFERENCES character(Name);

ALTER TABLE leader_of
ADD CONSTRAINT leader_of_t_name_fk FOREIGN KEY(T_name)
REFERENCES team(Team_name);