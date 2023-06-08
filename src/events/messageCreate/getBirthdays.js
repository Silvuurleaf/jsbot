
const {Client, Message} = requires('discord.js');
const Birthday = requires('../../models/birthdays');


/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message) => {
    if(!message.inGuild() || message.author.bot) return;

    const query = {
        userid: message.author.id,
        guildId: message.guildId
    }

    //call DB check for existence of user/channel

    try {
        const birthday = await Birthday.findOne(query);

        if (birthday){

        }

    }catch (error){}
}