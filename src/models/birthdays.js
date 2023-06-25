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

    channelId: {
        type: String,
        required: true,
    },

    username: {
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

    name : {
        type: String,
        required: false,
    }


});

module.exports = model('birthday', birthdaySchema);