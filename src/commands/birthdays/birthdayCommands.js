const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js')
const DB = require("../../models/birthdays")

module.exports = {
    name: 'birthday',
    description: 'Add remove and check birthday!',
    deleted: false,
    //devOnly: Boolean,
    //testOnly: Boolean,
    options: [
        {
            name:'add-birthday',
            description: 'Add a members birthday',
            type: ApplicationCommandOptionType.Subcommand, //SUB_COMMAND?
            options: [
                {
                    name: 'day',
                    description: 'Provide the day of your birthday',
                    type: Number,
                    required: true,
                },
                {
                    name: 'month',
                    description: 'Provide the month of your birthday',
                    type: Number,
                    required: true,
                },
                {
                    name: 'year',
                    description: 'Provide the year of your birthday',
                    type: Number,
                    required: true,
                }
            ]
        },
        {
            name:'remove',
            description: 'Removes birthday data',
            type: ApplicationCommandOptionType.Subcommand, //SUB_COMMAND?
        },
        {
            name: 'list',
            description: 'Lists out all the birthdays of the server.',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'Next',
            description: 'Gets the closest upcoming birthday',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'Prev',
            description: 'Gets the last birthday',
            type:ApplicationCommandOptionType.Subcommand,
        }
    ],

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],



    callback: (client, interaction) => {
        interaction.reply(`Birthday Command!`);

        const {guild, user, options} = interaction
        const Options = options.getSubcommand()

        switch(Options){
            case "add-birthday": {
                const date = new Date();
                const currentYear = date.getFullYear();
                const currentMonth = date.getMonth() + 1;
                const currentDate = date.getDate();

                const day = options.getInteger('day');
                const month = options.getInteger('month');
                const year = options.getInteger('year');
            }
        }


    },

};