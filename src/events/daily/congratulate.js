const { EmbedBuilder} = require('discord.js');
const Birthday = require('../../models/birthdays');

const search = require('youtube-search');

const congrats = async function (client) {

    console.log("checking bdays")

    //Gets the current date
    const currDate = Date.now();
    const dt = new Date(currDate)

    let day = dt.getDate();
    let month = dt.getMonth() + 1;
    let year = dt.getFullYear();

    day = 24;
    month = 5;

    //format query for current day
    let query = {Day:day, Month: month};

    //perform search on database (mongo) for users with matching birthday
    try {
        const birthdays = await Birthday.find(query);

        if(!birthdays) {
            console.log(`No birthdays ${month} / ${day} `);
            return;
        }

        for(let i = 0; i < birthdays.length; i++){

            console.log("getting channel id");
            let channelId = birthdays[i].channelId;
            console.log(channelId);

            let users_real_name = birthdays[i].name;

            let age = year - birthdays[i].Year;
            await client.channels.cache.get(channelId).send(`${users_real_name} turned ${age}! Happy Birthday!`);


            try{

                const opts = {
                    maxResults: 5,
                    key: process.env.YOUTUBE_API,
                    type: 'video'
                };

                if(users_real_name){
                    let fetch_results = await search(`HAPPY BIRTHDAY ${users_real_name}`, opts);

                    if(fetch_results){
                        let youtube_results = fetch_results.results;
                        let titles = youtube_results.map(result => {
                            return result.title;
                        });

                        let links = youtube_results.map(result => {
                            return result.link;
                        });

                        let thumbnails = youtube_results.map(result => {
                            return result.thumbnails
                        })

                        console.log(titles);
                        console.log(links);
                        console.log('creating embed happy bday')
                        let embed = new EmbedBuilder()
                            .setTitle(titles[0])
                            .setDescription(`It's ${birthdays[i].username}'s birthday!`)
                            .setURL(links[0])
                            .setThumbnail(thumbnails[0].default.url);

                        //send embed
                        await client.channels.cache.get(channelId).send({embeds: [embed]});
                    }



                }


            }catch (e){
                console.log(`Error: ${e}`);
                console.log(`Issue retrieving media for user ${birthdays[i].username} with name ${birthdays[i].name}`);
            }

        }


    } catch (e) {
        console.log(`Error: ${e}`);
    }

}

module.exports = {congrats}