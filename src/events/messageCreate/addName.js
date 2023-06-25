const {Client, Message} = require('discord.js');
const Birthday = require('../../models/birthdays');
const CheckBotPrefix = require('../../utils/checkBotPrefix');
const CommandsFromContent = require('../../utils/getCommandsFromContent');

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message) => {

    //make sure message was from correct channel and message wasn't made by a bot
    if(!message.inGuild() || message.author.bot) return;

    //check message had a prefix  and matches bot prefix
    const [, matchedPrefix] = CheckBotPrefix(client,message);

    if(!matchedPrefix)
        return

    //get the command from the message
    const command = CommandsFromContent(message, matchedPrefix);


    //general message information
    let _userId = message.author.id;
    let _guildId = message.guildId;
    let _channelId = message.channelId;


    //COMMANDS ASSOCIATED WITH BIRTHDAY BOT

    //add birthday command
    if (command === 'addName') {

        const query = {
            userId: message.author.id,
            guildId: message.guildId
        }

        //call DB check for existence of user/channel
        try {
            const birthday = await Birthday.findOne(query);

            if (!birthday){
                console.log(birthday);
                await message.author.send(`${message.member} you don't have a birthday registered. Add one first.`)
            }
            else {
                console.log("no bday");
                const msg_filter = (m) => m.author.id === message.author.id;

                let conversationLog = await message.author.send(`${message.member} would you like to add your name to your birthday records`);
                let dmChannel = conversationLog.channel;

                const collector = dmChannel.createMessageCollector({msg_filter, max: 1, time:1000*10})

                collector.on('collect', message => {
                    console.log(message.content);
                })
                collector.on('end', async collected => {

                    if (collected.size === 0) {
                        await message.author.send('No response detected')
                        return
                    }

                    let msg = collected.first().content.toLowerCase();

                    if (msg === 'yes' || 'y') {

                        await message.author.send(`${message.member} please provide your first name`)

                        dmChannel = conversationLog.channel;
                        const bday_collector = dmChannel.createMessageCollector({
                            msg_filter,
                            max: 1,
                            time: 1000 * 10
                        })
                        bday_collector.on('collect', message => {
                            console.log(message.content);
                        })
                        bday_collector.on('end', async collected => {

                            if (collected.size === 0) {
                                message.reply('No response detected')
                                return
                            }

                            let msg = collected.first().content;

                            console.log('save data to mongoDB');

                            let filter = {
                                userId: _userId,
                                guildId: _guildId,
                                channelId: _channelId,
                            }

                            let query = {
                                $set: {
                                    name: msg,
                                },
                            }

                            Birthday.updateOne(filter, query);

                            try {
                                await Birthday.updateOne(filter, query);
                                await message.author.send(`Thanks I've added your name to your birthday`);
                            }
                            catch (e){
                                console.log(`Error creating editing birthday to database for user ${message.author}`);
                                await message.author.send('Sorry there was an error editing your birthday. Please try again later')
                            }

                        })
                    }
                })

                if (birthday !== null) {
                    await birthday.save();
                }
            }

        }catch (error){
            console.log(`Error getting birthday: ${error}`);
        }
    }


}