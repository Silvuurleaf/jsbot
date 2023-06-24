import {Client, Message} from "discord.js";
import Birthday from '../../models/birthdays.js'
import CheckBotPrefix from "../../utils/checkBotPrefix.js";
import CommandsFromContent from "../../utils/getCommandsFromContent.js";
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

    let query;


    //COMMANDS ASSOCIATED WITH BIRTHDAY BOT

    //edit birthday command
    if (command === 'edit') {

        query = {
            userId: message.author.id,
            guildId: message.guildId
        }

        //TODO have edit save changes to the database
        //call DB check for existence of user/channel
        try {
            const birthday = await Birthday.findOne(query);

            if (!birthday){
                console.log(birthday);
                await message.author.send(`${message.member} you don't have birthday registered to edit`)
            }
            else {
                console.log("birthday found");
                const msg_filter = (m) => m.author.id === message.author.id;

                let conversationLog = await message.author.send(`${message.member} we found your birthday would you like to change it?`);
                let dmChannel = conversationLog.channel;

                const collector = dmChannel.createMessageCollector({msg_filter, max: 1, time:1000*10})

                collector.on('collect', message => {
                    console.log(message.content);
                })
                collector.on('end', async collected => {

                    if (collected.size === 0) {
                        await message.author.send('No response detected. Goodbye.')
                        return
                    }

                    let msg = collected.first().content.toLowerCase();

                    if (msg === 'yes' || 'y') {

                        await message.author.send(`${message.member} please provide your new birthdate MM/DD/YYYY`)

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
                                message.reply('No response detected. Goodbye.')
                                return
                            }

                            let msg = collected.first().content;
                            let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
                            let valid_date = date_regex.test(msg);

                            if (!valid_date) {
                                await message.author.send(`That was not a valid date in the form of MM/DD/YYYY. Please try again by messaging !jsbot in general chat`)
                            } else {
                                console.log('save data to mongoDB');

                                let date_arr = msg.split('/')
                                let month = Number(date_arr[0]);
                                let day = Number(date_arr[1]);
                                let year = Number(date_arr[2]);

                                console.log(`Parsed date ${month}/${day}/${year}`);

                                let filter = {
                                    userId: _userId,
                                    guildId: _guildId,
                                    channelId: _channelId,
                                }

                                let query = {
                                    $set: {
                                        Day: day,
                                        Month: month,
                                        Year: year
                                    },
                                }

                                Birthday.updateOne(filter, query);

                                try {
                                    await Birthday.updateOne(filter, query);
                                    await message.author.send(`Thanks I've updated your birthday`);
                                }
                                catch (e){
                                    console.log(`Error creating editing birthday to database for user ${message.author}`);
                                    await message.author.send('Sorry there was an error editing your birthday. Please try again later')
                                }

                            }
                        })
                    }
                })
            }

        }catch (error){
            console.log(`Error getting birthday: ${error}`);
        }
    }


}