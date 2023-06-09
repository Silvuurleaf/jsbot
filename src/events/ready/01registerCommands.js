import testServer from '../../../config.json'
import getLocalCommands from "../../utils/getLocalCommands.js";
import areCommandsDifferent from "../../utils/areCommandsDifferent.js";
import getApplicationCommands from "../../utils/getApplicationCommands.js";

const registerCommands = async function(client) {

    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer)

        //compare local and application commands
        for (const localCommand of localCommands){
            const {name, description, options} = localCommand;

            console.log(`name: ${name}, desc: ${description}`);

            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            if (existingCommand){
                if (localCommand.deleted){
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`Deleted command "${name}".`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)){
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });
                    console.log(`Edited command "${name}"`);
                }
            } else {

                console.log(`registering new command ${localCommand}`);

                if(localCommand.deleted){
                    console.log(`Skipping registered command "${name}" as the
                     command is to be deleted`);
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                })

                console.log(`Registered command "${name}"`);
            }
        }

    }catch (error){
        console.log(`An error occured registering commands: ${error}`);
    }



};

export default registerCommands;