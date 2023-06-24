const CheckBotPrefix = function (client, message){

    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const prefix = '!'

    let botPrefix = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`)

    //check if message matches bot prefix if not escape
    if (!botPrefix.test(message.content)) return;

    return message.content.match(botPrefix)

};

export default CheckBotPrefix;
