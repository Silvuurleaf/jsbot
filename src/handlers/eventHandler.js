import path from 'path'
import getAllFiles from '../utils/getAllFiles.js'


import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const eventHandler = function (client){

    //TODO change __dirname to process.cwd() for replit
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
                    //TODO is this an issue with es6
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