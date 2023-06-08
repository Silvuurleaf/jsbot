const {model, Schema} = require('mongoose');

module.exports = model("birthdayChannel") , new Schema({
    guildId: String,
    channel: String,
});