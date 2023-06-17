const {Client, Message} = require('discord.js');
const Birthday = require('../../models/birthdays');

const congrats = async function (client) {

    console.log("checking bdays")

    const currDate = Date.now();
    const dt = new Date(currDate)

    let day = dt.getDate();
    let month = dt.getMonth() + 1;
    let year = dt.getFullYear();

    day = 24;
    month = 5;

    //format query for current day
    let query = {Day:day, Month: month};

    try {
        const birthdays = await Birthday.find(query);

        if(!birthdays) {
            console.log(`No birthdays ${month} / ${day} `);
            return;
        }


        for(let i =0; i < birthdays.length; i++){

            console.log("getting channel id");
            let channelId = birthdays[i].channelId;
            console.log(channelId);

            let age = year - birthdays[i].Year;
            await client.channels.cache.get(channelId).send(`${birthdays[i].username} turned ${age}! Happy Birthday!`);
        }


    } catch (e) {
        console.log(`Error: ${e}`);
    }

}

module.exports = {congrats}