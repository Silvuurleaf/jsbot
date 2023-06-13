require("dotenv").config();
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
    ]

});

//immediate invoked expression
(async () => {

    try{
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.SERVER_CONN_STRING, {keepalive: true});
        console.log("connected to mongoDB");
        eventHandler(client);

        client.login(process.env.BOTTOKEN).then(
            r => console.log(r)
        );
    }
    catch (error){
        console.log(`Error:  ${error}`);
    }
})();


/*client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);
});

client.on('messageCreate', (message) => {
    console.log(message.content);

    if (message.author.bot){
        return
    }


    if (message.content === 'hello'){
        message.reply('hello');
    }
})*/


