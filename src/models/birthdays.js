import mongoose, { Schema } from 'mongoose';

const birthdaySchema = new Schema (
    {
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
    }
)

const Birthday = mongoose.model('Birthdays', birthdaySchema);

export default Birthday;