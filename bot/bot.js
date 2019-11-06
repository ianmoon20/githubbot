const Discord = require('discord.js');
const command = require('./commands.js');

const client = new Discord.Client();

const debug = false;

const token = process.env.TOKEN;

const diceCommands = {
    '!highest': command.RollHighest,
    '!roll': command.RollDice,
};
const otherCommands = {
    '!help': command.help,
    '!ban': command.ban,
    '!unban': command.unban,
    '!banlist': command.banList,
    '!admin': command.admin,
    '!revoke': command.unadmin,
    '!adminlist': command.adminList,
};

const customCommands = {

};

const greetings = {
    //Jonny
    "222039245685129217": "Oh... he's here. Don't let him roll me.",
    //Gaige
    "335057766710247425": "I'm scared. ల(｀°Δ°)",
    //Van
    "225430614260711424": 'The mighty king has returned to his throne to bless the land with his presence! Hoozah! Three cheers for Van! Hip-Hip-Hooray! Hip-Hip-Hooray! Hip-Hip-Hooray! Roll me dear master!',
    //Ian
    "251911037178085376": 'Creator! owo',
    //Nick J
    "308410594002731008": "Act natural act natural... we've done nothing wrong.",
    //Merrick
    "300095616116195330": "I've never been so happy! ヽ(*￣o￣*)ノ♩♫♪"
};

const leaving = {
    //Jonny
    "222039245685129217": 'Phew. That was a close one.',
    //Gaige
    "335057766710247425": "Are we safe...?",
    //Van
    "225430614260711424": 'I miss him already..',
    //Ian
    "251911037178085376": 'What am I without my creator? omo',
    //Nick J
    "308410594002731008": "Okay, don't panic, alright? Stop panicking!",
    //Merrick
    "300095616116195330": "I've never experienced such crushing sadness.. (⌣̩̩́_⌣̩̩̀)"
};

client.on('ready', () => {
    if (debug) {
        command.bannedUsers.Ian = "I'm sorry Master.. omo";
    }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    const newUserChannel = newMember.voiceChannel;
    const oldUserChannel = oldMember.voiceChannel;
    const channel = newMember.guild.channels.find(ch => ch.name === 'general');
    //console.log("Channel name: " + channel + " " + channel.name);
    if (!channel) return;

    if (oldUserChannel === undefined && newUserChannel !== undefined) {
        //console.log("ID: " + newMember.user.id + " Username: " + newMember.user.username);
        if (greetings[newMember.user.id]) {
            // User Joins a voice channel
            channel.send(greetings[newMember.user.id]);
        }
    } else if (newUserChannel === undefined && leaving[newMember.user.id]) {
        // User leaves a voice channel
        //console.log("ID: " + newMember.user.id + " Username: " + newMember.user.username);
        channel.send(leaving[newMember.user.id]);
    }
});

client.on('message', msg => {
    const content = msg.content;

    if (content[0] === '!') {
        let firstSpace = content.indexOf(' ');
        if (firstSpace === -1) {
            firstSpace = content.length;
        }
        const firstWord = content.substr(0, firstSpace);
        let results = '';
        let response = '\n';
        let user = '';
        const author = msg.author.username;
        const authorID = msg.author.id;

        if (diceCommands[firstWord]) {
            //console.log("Dice command: " + firstWord);
            const dPos = content.toLowerCase().indexOf('d');
            const num = parseInt(content.slice(firstSpace + 1, dPos), 10);
            let mod = 0;
            let modPos = content.length;
            if (content.includes("+")) {
                modPos = content.toLowerCase().indexOf('+');
            } else if (content.includes("-")) {
                modPos = content.toLowerCase().indexOf('-');
            }
            const size = parseInt(content.slice(dPos + 1, modPos), 10);
            if (modPos != content.length) {
                mod = parseInt(content.slice(modPos, content.length), 10);
            }
            results = diceCommands[firstWord](author, num, size, mod);
            const length = Object.keys(results).length;

            for (let i = 0; i < length - 1; i++) {
                response += `Die ${i + 1}: ${results[i]}\n`;
            }

            response += `Result: ${results.result}`;

            return msg.reply(response);
        } else if (customCommands.hasOwnProperty(authorID) && customCommands[authorID][firstWord]) {
            //TO DO: Can be refactored with the code in Dice Commands
            contentMsg = customCommands[authorID][firstWord];
            const dPos = contentMsg.toLowerCase().indexOf('d');
            const num = parseInt(contentMsg.slice(firstSpace + 1, dPos), 10);
            let mod = 0;
            let modPos = contentMsg.length;
            if (contentMsg.includes("+")) {
                modPos = contentMsg.toLowerCase().indexOf('+');
            } else if (contentMsg.includes("-")) {
                modPos = contentMsg.toLowerCase().indexOf('-');
            }
            const size = parseInt(contentMsg.slice(dPos + 1, modPos), 10);
            if (modPos != contentMsg.length) {
                mod = parseInt(contentMsg.slice(modPos, contentMsg.length), 10);
            }
            results = diceCommands[firstWord](author, num, size, mod);
            const length = Object.keys(results).length;

            for (let i = 0; i < length - 1; i++) {
                response += `Die ${i + 1}: ${results[i]}\n`;
            }

            response += `Result: ${results.result}`;

            return msg.reply(response);
        } else if (otherCommands[firstWord]) {
            //console.log("Other command: " + firstWord);
            user = content.slice(firstSpace + 1, content.length);
            response = otherCommands[firstWord](user, authorID, client);

            if (response.embed) {
                const length = Object.keys(response).length;
                const embed = new Discord.RichEmbed();
                embed.setTitle('Help');
                embed.setColor(3447003);
                embed.setDescription('This is a list of commands as well as examples of how to use them.');
                embed.setTimestamp();

                for (let i = 0; i < length - 1; i++) {
                    embed.addField(response[i].name, `${response[i].desc}\nExample: ${response[i].usage}`);
                }
                return msg.channel.send({
                    embed,
                });
            }

            return msg.channel.send(response);
        } else if (firstWord == "!create") {
            //console.log("Creating Command...");
            const secondspace = content.indexOf(' ', str.indexOf(' ') + 1);
            const name = content.substr(firstSpace + 1, secondspace);
            //console.log(name);
            const purpose = content.substr(secondspace + 1, content.length);
            //console.log(pupose);

            if (!customCommands.hasOwnProperty(authorID)) {
                customCommands[authorID] = {};
            }

            customCommands[authorID][firstWord] = purpose;

        } else if (firstWord == "!commands") {
            //console.log("Listing commands...");
            //console.log("Have ID?: " + !customCommands.hasOwnProperty(authorID))
            if (!customCommands.hasOwnProperty(authorID)) {
                response += `You don't have any custom commands. See !help.`;
            } else {
                response += `Here are your custom commands: `;
                for (var keys in customCommands[authorID]) {
                    //console.log(keys);
                    response += keys + `: ` + customCommands[authorID][keys] + `\n`;
                }
            }

            //console.log(response);
            return msg.reply(response);
        }

        return msg.reply(`Invalid Command. (${firstWord}) >-<`);
    }
    return false;
});

client.login(token);
