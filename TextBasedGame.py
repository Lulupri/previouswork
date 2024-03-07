# Adrianna Allen


# Shows the goal of the game and movements the user to use
def show_instructions():
    # print main menu with the commands
    print('Soul Searching Text Adventure Game')
    print('Collect all 6 soul fragments and escape the forest to return home!')
    print('Move commands: South, North, West, East')
    print('To add soul fragment to your inventory, enter ''"Catch Soul"''')
    print('------------------------')


# Function to print the current room, user's inventory, and possible actions
def display_status(current_room, rooms, user_inv):
    print('You are in the ' + current_room)
    print('Inventory: {}'.format(str(user_inv)))  # + user_inv
    if current_room != 'Forest Entrance':
        if rooms[current_room]['catch soul'] not in user_inv:
            # Display item in room
            print('There''s ' + rooms[current_room]['catch soul'] + '!')

            if rooms[current_room] != 'Forest Exit':
                print('You can catch it if you are quick!')

    print('------------------------')


# Move user to their desired room
def move_player(current_room, rooms, action):
    current_room = rooms[current_room][action]
    return current_room


# Get soul from current location and add to user's inventory
def get_soul(current_room, rooms, user_inv):
    if rooms[current_room]['catch soul'] not in user_inv:
        user_inv.append(rooms[current_room]['catch soul'])

    else:
        print('Nothing to catch')

    return user_inv


def main():
    # dictionary for the rooms with directions and items
    rooms = {"Forest Entrance": {'east': 'Whimsical Fairy Lake', 'south': 'Elves Corridor'},
             "Whimsical Fairy Lake": {'west': 'Forest Entrance', 'south': 'Magic Beach', 'catch soul': 'soul #1'},
             "Elves Corridor": {'north': 'Forest Entrance', 'east': 'Magic Beach',
                                'south': 'Jester''s Reef', 'catch soul': 'soul #6'},
             "Jester""s Reef": {'north': 'Elves Corridor', 'east': 'The Velvet Library', 'catch soul': 'soul #4'},
             "Magic Beach": {'north': 'Whimsical Fairy Lake', 'west': 'Elves Corridor',
                             'east': 'Tea Tree Forest', 'south': 'The Velvet Library', 'catch soul': 'soul #5'},
             "The Velvet Library": {'north': 'Magic Beach', 'west': 'Jester''s Reef', 'catch soul': 'soul #2'},
             "Tea Tree Forest": {'west': 'Magic Beach', 'south': 'Forest Exit', 'catch soul': 'soul #3'},
             "Forest Exit": {'north': 'Tea Tree Forest', 'catch soul': 'The Soul Catcher'}
             }

    win = False

    # Empty inventory
    user_inv = []

    # Sets current_room to default room
    current_room = 'Forest Entrance'

    # Display main menu
    show_instructions()

    # loop for game
    while len(user_inv) != 6 and current_room != 'Forest Exit':

        # Display user's status
        display_status(current_room, rooms, user_inv)

        # Get user's action
        action = input('Enter your action: ').lower()

        # Validate user input
        while action not in rooms[current_room]:
            print('Invalid action, try again')
            action = input('Enter your action: ')
            action = action.lower()

        # If player chooses to collect soul, call get soul function
        if action == 'catch soul':
            user_inv = get_soul(current_room, rooms, user_inv)

        # If player chooses to move, call move player function
        else:
            current_room = move_player(current_room, rooms, action)

        # If the user is in the forest exit and doesn't have all their soul fragments, they lost
        if len(user_inv) != 6 and current_room == 'Forest Exit':
            break

        # If the user is in the forest exit and have all their soul fragments, they won
        if len(user_inv) == 6:
            win = True

    display_status(current_room, rooms, user_inv)
    if win:
        print('With your soul completed and the Soul Catcher overwhelmed, you return home safe and sound. You win!')
    else:
        print('The Soul Catcher absorbs you! Game over, try again!')


if __name__ == '__main__':
    main()
