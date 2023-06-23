const getCommandsFromContent = function(message, matchedPrefix){

    //get the commands following the prefix
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/)
    //console.log(args);

    //command is the 2nd entry in args
    //Can be changed to handle more inputs
    return args[1];
};

export default getCommandsFromContent;