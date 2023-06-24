
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

    let query;


    //COMMANDS ASSOCIATED WITH BIRTHDAY BOT

    //add birthday command
    if (command === 'delete') {

        query = {
            userId: message.author.id,
            guildId: message.guildId
        }

        //call DB check for existence of user/channel
        try {
            const birthday = await Birthday.findOne(query);

            if (!birthday){
                console.log(birthday);
                await message.author.send(`${message.member}, you don't have a birthday registered you can delete.`)
            }
            else {
                console.log("birthday found")
                const msg_filter = (m) => m.author.id === message.author.id;

                let conversationLog = await message.author.send(`${message.member} you have a birthday registered. Would you like to delete it?`);
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

                    if (msg === 'yes' || 'y'){

                        console.log(`attempting to delete user's birthday`);

                        query = {
                            userId: _userId,
                            guildId: _guildId,
                        }


                        try {
                            await Birthday.findOneAndRemove(query);
                            await message.author.send(`${message.member}, your birthday has been removed`);
                        }catch (e){
                            console.log(`Error occured deleting ${message.member}'s birthday`)
                            await message.author.send(`${message.member}, there was an error deleting your birthday sorry.`);
                        }

                    }
                })

            }

        }catch (error){
            console.log(`Error deleting ${message.member}'s birthday: ${error}`);
        }
    }


}