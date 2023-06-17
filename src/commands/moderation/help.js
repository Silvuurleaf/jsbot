module.exports = {
    name: 'help',
    description: 'defines commands bot is capable of',
    //devOnly: Boolean,
    //testOnly: Boolean,

    callback: (client, interaction) => {
        interaction.reply(`Help screen`);
    },
};