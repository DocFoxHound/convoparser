const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");

// Initialize dotenv config file
const args = process.argv.slice(2);
let envFile = ".env";
if (args.length === 1) {
  envFile = `${args[0]}`;
}
dotenv.config({
  path: envFile,
});

// Get directory path from environment variable
const directoryChatInput = process.env.FILE_INPUT;
const directoryChatOutput = process.env.FILE_OUTPUT;

allJsonFiles = [];

if (!directoryChatInput) {
    console.log('Please set the JSON_DIR environment variable');
    process.exit(1);
}

fs.readdir(directoryChatInput, (err, files) => {
    if (err) {
        console.log('Error reading directory:', err);
        return;
    }
    files.filter(file => file.endsWith('.json')).forEach(file => {
        allJsonFiles.push(path.join(directoryChatInput, file));
    });

    //read each file
    readFiles(allJsonFiles);
});

function readFiles(allJsonFiles){
    for (const file of allJsonFiles) {
        const data = fs.readFileSync(file, 'utf8');
        const jsonData = JSON.parse(data);
        checkMessage(jsonData);
    }
}

function checkMessage(jsonData){
    let formattedConvo = [];
    let chatName = jsonData.channel.name;
    for (const message of jsonData.messages) {
        //ignore messages from bots
        if (message.author.id === process.env.BOT_ID){
            console.log("Test")
            break;
        }

        //if the message is a reply, do things to do
        if(message.type === "Reply"){
            try{
            //get the source message  of the reply
            const sourceMessageId = message.reference.messageId;
            //get that message id
            const sourceMessage = jsonData.messages.find(m => m.id === sourceMessageId);
            //format the sourceMessage
            formattedConvo.push(formatMessage(sourceMessage, message));
            }catch(error){
                console.log(`Error with getting the source message: ${error}`)
            }
        }
    }
    saveFile(formattedConvo, chatName);
}

function formatMessage(sourceMessage, message){
    const formattedMessage = 
        {"messages": [{"role": "system", "content": `${process.env.BOT_DESCR}`}, 
        {"role": "user", "content": `${sourceMessage.content}`}, 
        {"role": "assistant", "content": `${message.content}`}]}
    ;
    return formattedMessage;
}

function saveFile(formattedConvo, chatName){
        // const jsonString = JSON.stringify(formattedConvo, null, 4);
        const jsonlString = formattedConvo.map(obj => JSON.stringify(obj)).join('\n');
    fs.writeFile(`${directoryChatOutput}/${chatName}.jsonl`, jsonlString, err => {
        if (err) {
            console.error('Error writing JSON to file: ', err);
        } else {
            console.log('Successfully wrote JSON to file');
        }
    });
}