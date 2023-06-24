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
    const command = GetCommandsFromContent(message, matchedPrefix);


    //general message information
    let _userId = message.author.id;
    let _guildId = message.guildId;
    let _channelId = message.channelId;


    //COMMANDS ASSOCIATED WITH BIRTHDAY BOT

    //add birthday command
    if (command === 'add') {

        const query = {
            userId: message.author.id,
            guildId: message.guildId
        }

        //call DB check for existence of user/channel
        try {
            const birthday = await Birthday.findOne(query);

            if (birthday){
                console.log(birthday);
                await message.author.send(`${message.member} you already have a birthday registered`)
            }
            else {
                console.log("no bday");
                const msg_filter = (m) => m.author.id === message.author.id;

                let conversationLog = await message.author.send(`${message.member} you don't have a birthday registered. Would you like to save one?`);
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

                        await message.author.send(`${message.member} please provide your birthdate MM/DD/YYYY`)

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


                                let newBirthday = new Birthday({
                                    userId: _userId,
                                    guildId: _guildId,
                                    channelId: _channelId,
                                    username: message.member,
                                    Day: day,
                                    Month: month,
                                    Year: year
                                });

                                try {
                                    newBirthday = await newBirthday.save();
                                    await message.author.send(`Thanks I've saved your birthday`);
                                }
                                catch (e){
                                    console.log(`Error creating saving birthday to database for user ${message.author}`);
                                    await message.author.send('Sorry there was an error saving your birthday. Please try again later')
                                }

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