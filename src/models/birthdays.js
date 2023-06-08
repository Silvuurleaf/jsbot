const {Schema, model} = require('mongoose')

const birthdaySchema = new Schema({
    userId: {
        type: String,
        required: true,
    },

    guildId: {
        type: String,
        required: true,
    },

    Day: {
        type: Number,
        required: true,
    },

    Month: {
        type: Number,
        required: true,
    },

    Year: {
        type: Number,
        required: true,
    },


    defaultMessage: {
        type: String,
        required: false,
    },



});

module.exports = model('birthday', birthdaySchema);