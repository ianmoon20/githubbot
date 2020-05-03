const Discord = require('discord.js');
const command = require('./commands.js');

const client = new Discord.Client();

const debug = false;

const token = process.env.TOKEN;
const hasKilled = false;

const diceCommands = {
    '!highest': command.RollHighest,
    '!roll': command.RollDice,
};

const adminCommands = {
    '!help': command.help,
    '!ban': command.ban,
    '!unban': command.unban,
    '!banlist': command.banList,
    '!admin': command.admin,
    '!revoke': command.unadmin,
    '!adminlist': command.adminList,
    '!unadmin': command.unadmin,
};

const nickCommands = {
    '!confirmkill': command.confirmKill,
    '!setmonster': command.setMonster,
    '!reroll': command.reroll,
    '!setbounty': command.setBounty,
    '!modifypoints': command.modifyPoints,
    '!stats': command.getStats
};

const customCommands = {
    universal: {
        '!2': '1d2+0',
        '!4': '1d4+0',
        '!6': '1d6+0',
        '!8': '1d8+0',
        '!10': '1d10+0',
        '!12': '1d12+0',
        '!20': '1d20+0',
        '!100': '1d100+0',
    },
};

const greetings = {
    // Jonny
    '222039245685129217': "Oh... he's here. Don't let him roll me.",
    // Gaige
    '335057766710247425': "I'm scared. ల(｀°Δ°)",
    // Van
    '225430614260711424': 'The mighty king has returned to his throne to bless the land with his presence! Hoozah! Three cheers for Van! Hip-Hip-Hooray! Hip-Hip-Hooray! Hip-Hip-Hooray! Roll me dear master!',
    // Ian
    '251911037178085376': 'Creator! owo',
    // Nick J
    '308410594002731008': "Act natural act natural... we've done nothing wrong.",
    // Merrick
    '300095616116195330': "I've never been so happy! ヽ(*￣o￣*)ノ♩♫♪",
    // Blayda
    '275760710728810496': "Bet you won't even arrest me. ಠ╭╮ಠ",
};

const leaving = {
    // Jonny
    '222039245685129217': 'Phew. That was a close one.',
    // Gaige
    '335057766710247425': 'Are we safe...?',
    // Van
    '225430614260711424': 'I miss him already..',
    // Ian
    '251911037178085376': 'What am I without my creator? omo',
    // Nick J
    '308410594002731008': "Okay, don't panic, alright? Stop panicking!",
    // Merrick
    '300095616116195330': "I've never experienced such crushing sadness.. (⌣̩̩́_⌣̩̩̀)",
    // Blayda
    '275760710728810496': 'There goes the Fake Cop. (☞ﾟ∀ﾟ)☞',
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
    if (!channel) return;

    if (oldUserChannel === undefined && newUserChannel !== undefined) {
        if (newMember.user.id === '251911242824941569') {
            channel.send(nickCommands['!setmonster']('371114586796982276'));
        }
        // User Joins a voice channel
        channel.send(greetings[newMember.user.id]);
    } else if (newUserChannel === undefined && leaving[newMember.user.id]) {
        if (newMember.user.id === '251911242824941569') {
            command.nickLeaving();
        }
        channel.send(leaving[newMember.user.id]);
    }
});

client.on('message', msg => {
    const content = msg.content.trim();

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
            const dPos = content.toLowerCase().indexOf('d');
            const num = parseInt(content.slice(firstSpace + 1, dPos), 10);
            let mod = 0;
            let modPos = content.length;
            if (content.includes('+')) {
                modPos = content.toLowerCase().indexOf('+');
            } else if (content.includes('-')) {
                modPos = content.toLowerCase().indexOf('-');
            }
            if (modPos !== content.length) {
                mod = parseInt(content.slice(modPos, content.length), 10);
            }
            const size = parseInt(content.slice(dPos + 1, modPos), 10);
            results = diceCommands[firstWord](author, num, size, mod);
            const length = Object.keys(results).length;

            for (let i = 0; i < length - 1; i++) {
                response += `Die ${i + 1}: ${results[i]}\n`;
            }

            response += `Result: ${results.result}`;

            return msg.reply(response);
        } else if (customCommands.hasOwnProperty(authorID) && customCommands[authorID][firstWord]) {
            const contentMsg = customCommands[authorID][firstWord];
            const dPos = contentMsg.toLowerCase().indexOf('d');
            const num = parseInt(contentMsg.slice(0, dPos), 10);
            let mod = 0;
            let modPos = contentMsg.length;
            if (contentMsg.includes('+')) {
                modPos = contentMsg.toLowerCase().indexOf('+');
            } else if (contentMsg.includes('-')) {
                modPos = contentMsg.toLowerCase().indexOf('-');
            }
            if (modPos !== contentMsg.length) {
                mod = parseInt(contentMsg.slice(modPos, contentMsg.length), 10);
            }
            const size = parseInt(contentMsg.slice(dPos + 1, modPos), 10);
            results = command.RollDice(author, num, size, mod);
            const length = Object.keys(results).length;

            for (let i = 0; i < length - 1; i++) {
                response += `Die ${i + 1}: ${results[i]}\n`;
            }

            response += `Result: ${results.result}`;

            return msg.reply(response);
        } else if (customCommands.universal.hasOwnProperty(firstWord)) {
            // TO DO: Can be refactored with the code in Dice Commands
            const contentMsg = customCommands.universal[firstWord];
            const dPos = contentMsg.toLowerCase().indexOf('d');
            const num = parseInt(contentMsg.slice(0, dPos), 10);
            let mod = 0;
            let modPos = contentMsg.length;
            if (contentMsg.includes('+')) {
                modPos = contentMsg.toLowerCase().indexOf('+');
            } else if (contentMsg.includes('-')) {
                modPos = contentMsg.toLowerCase().indexOf('-');
            }
            if (modPos !== contentMsg.length) {
                mod = parseInt(contentMsg.slice(modPos, contentMsg.length), 10);
            }
            const size = parseInt(contentMsg.slice(dPos + 1, modPos), 10);
            results = command.RollDice(author, num, size, mod);
            const length = Object.keys(results).length;

            for (let i = 0; i < length - 1; i++) {
                response += `Die ${i + 1}: ${results[i]}\n`;
            }

            response += `Result: ${results.result}`;

            return msg.reply(response);
        } else if (adminCommands[firstWord]) {
            if (msg.mentions.users.first()) {
                user = msg.mentions.users.first().id;
            } else {
                user = content.slice(firstSpace + 1, content.length);
            }
            response = adminCommands[firstWord](user, authorID, client);

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
        } else if (firstWord === '!remove') {
            const name = `!${content.substr(firstSpace + 1, content.length).toLowerCase()}`;

            if (name.length <= 0) {
                response += 'Missing the name. Format should be like the following: !remove fireball.';
            } else {
                if (customCommands.hasOwnProperty(authorID) && customCommands[authorID][name]) {
                    delete customCommands[authorID][name];
                    response += `Command ${name} successfully deleted`;
                } else {
                    response += `You don't have the ${name}`;
                }
            }

            return msg.reply(response);
        } else if (firstWord === '!commands') {
            if ((!customCommands.hasOwnProperty(authorID) || Object.keys(customCommands[authorID]).length == 0) && Object.keys(customCommands.universal).length == 0) {
                response += 'You don\'t have any custom commands. See !help.';
            } else {
                response += ' Universal: \n';
                for (var keys in customCommands.universal) {
                    response += `${keys}: ${customCommands.universal[keys]}\n`;
                }
                response += 'Personal: \n';
                for (var keys in customCommands[authorID]) {
                    response += `${keys}: ${customCommands[authorID][keys]}\n`;
                }
            }

            return msg.reply(response);
        } else if (nickCommands[firstWord]) {
            const num = parseInt(content.slice(firstSpace + 1, content.length), 10);
            response = nickCommands[firstWord](authorID, num, client);

            return msg.channel.send(response);
        }

        return msg.reply(`Invalid Command. (${firstWord}) >-<`);
    }
    return false;
});

client.login(token);
