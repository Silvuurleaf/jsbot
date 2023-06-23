import path from 'path';
import getAllFiles from "../utils/getAllFiles.js";

const eventHandler = function(client) {

    //change path to process.cwd() for replit deployment
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        //console.log(eventFiles)

        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop()
        //console.log(eventName)

        eventFiles.sort((a,b) => a > b);
        //console.log(eventFiles);


        client.on(eventName, async(arg) => {
            for(const eventFile of eventFiles){

                try {
                    const eventFunction = require(eventFile);
                    await eventFunction(client, arg)
                }catch (error){
                    console.log(`Error: ${error}! From calling eventfile: ${eventFile}`);
                }


            }
        })
    }

};

export default eventHandler;