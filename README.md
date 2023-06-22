# Birthday Bot JS

## Description

This is a discord bot that can be deployed into your server and uses mongoDB to
save, edit, read, and delete birthdays for users.

## Prerequisites
Discord account and be the admin of the server you want to deploy your bot on.

MongoDB account to link your database. (Can switch the DB will require small code changes)


## Instructions
Create a .env file to store all DB passwords and discord bot tokens

Discord
- you'll need to go to discord's developer portal and register your Bot and
  receive a token/key to link the bot.
- There are a lot of tutorials online of how to do this, but this is the one I used.

  https://www.youtube.com/watch?v=KZ3tIGHU314&t=1392s

MongoDB
- create a new database application and then save the server connection string and password
  in your .env file.

To start the bot type nodemon in the terminal and the bot should start running.
```text
 C:/ProjectFolder/discordBotJs/jsbot> nodemon
```

The bot should start up logging connection to mongoDB and saying the bot has gone online
along with registeration of any commands.


## Usage 

The bot uses both slash commands and message commands.

The bot prefix is !jsbot

The bot expects an affirmative 'yes' or 'y' in response to questions other answers will terminate 
the conversation and require the command to be entered again. 

The bot expects birthday's to be in the format MM/DD/YYYY other formats will not be processed.

#### Message Commands
!jsbot add &nbsp;&nbsp;         Starts a DM with the bot and add their birthday to the DB

!jsbot delete &nbsp;&nbsp;      Starts a DM with the bot and if the user has a registered birthday they may delete it.

!jsbot edit  &nbsp;&nbsp;       Starts a DM with the bot and if the user has a registered birthday they may change it


#### Slash Commands
Currently, there is only one slash command

/help               *WIP* Will display all the message commands avaliable to the bot

###

The bot will check the database once a day to see if there are any matching birthdays for the current date.
If there is a birthday a message will be sent to first text chat mentioning the user and their age.