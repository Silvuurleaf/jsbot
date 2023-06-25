require("dotenv").config();
const mongoose = require('mongoose');

const eventHandler = require('./handlers/eventHandler');
const congrats = require("./events/daily/congratulate");

const { Client, GatewayIntentBits } = require('discord.js')


// 24 hr interval
const congrats_interval = 5000;//1000 * 60 * 60 * 24


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


        //check mongoDB for current bdays
        setInterval(await function () {congrats.congrats(client)}, congrats_interval);
        //start event handler
        eventHandler(client);
        //login to using bot token

        await client.login(process.env.BOTTOKEN)

    }
    catch (error){
        console.log(`Error:  ${error}`);
    }
})();



