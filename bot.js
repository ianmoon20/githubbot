const Discord = require('discord.js');
const command = require('./commands.js');

const client = new Discord.Client();

const debug = false;

const diceCommands = {
    "!highest": command.RollHighest,
    "!roll": command.RollDice,
};
const otherCommands = {
    "!help": command.help,
    "!ban": command.ban,
    "!unban": command.unban,
    "!banlist": command.banList,
}

const greetings = {
    "PoloSpankin": "Oh... he's here. Don't let him roll me.",
    "Vandush": "The mighty king has returned to his throne to bless the land with his presence! Hoozah! Three cheers for Van! Hip-Hip-Hooray! Hip-Hip-Hooray! Hip-Hip-Hooray! Roll me dear master!",
    "Ian": "Master! owo",
    "THELAGPYRO": "Act natural act natural... we've done nothing wrong.",
};

const leaving = {
    "PoloSpankin": "Phew. That was a close one.",
    "Vandush": "I miss him already..",
    "Ian": "What am I without my creator? omo",
    "THELAGPYRO": "Okay, don't panic, alright? Stop panicking!",
};

client.on('ready', () => {
    console.log("I am ready!");
    if (debug) {
        command.bannedUsers["Ian"] = "I'm sorry Master.. omo";
    }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel
    let oldUserChannel = oldMember.voiceChannel
    const channel = newMember.guild.channels.find(ch => ch.name === 'nsfw-globalmemedomination');
    if (!channel) return;

    if (oldUserChannel === undefined && newUserChannel !== undefined && greetings[newMember.user.username]) {

        // User Joins a voice channel
        channel.send(greetings[newMember.user.username]);

    } else if (newUserChannel === undefined && leaving[newMember.user.username]) {

        // User leaves a voice channel
        channel.send(leaving[newMember.user.username]);
    }
})

client.on('message', msg => {
    const content = msg.content;

    if (content[0] === "!") {
        let firstSpace = content.indexOf(" ");
        if (firstSpace === -1) {
            firstSpace = content.length;
        }
        const firstWord = content.substr(0, firstSpace);
        let results = "";
        let response = "\n";
        let user = "";
        let author = msg.author.username;

        if (diceCommands[firstWord]) {
            const dPos = content.toLowerCase().indexOf("d");
            const num = content.slice(firstSpace + 1, dPos);
            const size = parseInt(content.slice(dPos + 1, content.length));
            results = diceCommands[firstWord](author, num, size);
            const length = Object.keys(results).length;

            for (let i = 0; i < length - 1; i++) {
                response += `Die ${i+1}: ${results[i]}\n`
            }

            response += `Result: ${results["result"]}`;

            return msg.reply(response);
        } else if (otherCommands[firstWord]) {
            user = content.slice(firstSpace + 1, content.length);
            response = otherCommands[firstWord](user, author, client);
            console.log(response);

            if (response['embed']) {
                const length = Object.keys(response).length;
                const embed = new Discord.RichEmbed().setTitle("Help").setColor(3447003).setDescription("This is a list of commands as well as examples of how to use them.").setTimestamp();

                for (let i = 0; i < length-1; i++) {
                    embed.addField(response[i]['name'], response[i]['desc'] + `\nExample: ${response[i]['usage']}`);
                }
                return msg.channel.send({
                    embed
                });
            }
            
            return msg.channel.send(response);
        } else {
            return msg.reply("that's some Rob shit right there. >-< (Invalid Command.)");
        }
    }
});

client.login(process.env.TOKEN);
