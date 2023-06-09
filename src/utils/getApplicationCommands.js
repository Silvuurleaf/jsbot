const getApplicationCommands = async function(client, guildId){
    let applicationCommands;

    if(guildId){
        const guild = await client.guilds.fetch(guildId);
        applicationCommands = guild.commands;
    } else {
        applicationCommands = await client.application.commands;
    }

    await applicationCommands.fetch();

    return applicationCommands;
};

export default getApplicationCommands;