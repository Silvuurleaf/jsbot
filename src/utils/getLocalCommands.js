import path from 'path';
import getAllFiles from './getAllFiles.js'
const getLocalCommands = function(exceptions = []) {
    let localCommands = [];

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