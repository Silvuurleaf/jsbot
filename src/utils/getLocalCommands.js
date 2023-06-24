import path from 'path'
import getAllFiles from './getAllFiles.js'

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getLocalCommands = function(exceptions = []){
    let localCommands = [];

    //TODO need to change __dirname to process.cwd() for replit

    const commandCategories = getAllFiles(
        path.join(__dirname, '..','commands'),
        true
    )

    console.log(commandCategories);

    for(const commandCategory of commandCategories){
        const commandFiles = getAllFiles(commandCategory);

        console.log(commandFiles);



        //go through all command files
        for (const commandFile of commandFiles){
            const commandObject = require(commandFile);

            if(exceptions.includes(commandObject.name)){
                continue;
            }

            localCommands.push(commandObject);
        }
    }

    return localCommands;
}

export default getLocalCommands;