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
}

const greetings = {
    "PoloSpankin": "Oh... he's here. Don't let him roll me.",
    "Vandush": "The mighty king has returned to his throne to bless the land with his presence! Hoozah! Three cheers for Van! Hip-Hip-Hooray! Hip-Hip-Hooray! Hip-Hip-Hooray! Roll me dear master!",
    "Ian": "Master! owo",
};

const leaving = {
    "PoloSpankin": "Phew. That was a close one.",
    "Vandush": "I miss him already..",
    "Ian": "What am I without my creator? omo",
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
        console.log(firstWord);
        let response = "Invalid Command";
        let user = msg.author.username;

        if (diceCommands[firstWord]) {
            console.log("Dice Command");
            const dPos = content.indexOf("d");
            const num = content.slice(firstSpace + 1, dPos);
            const size = parseInt(content.slice(dPos + 1, content.length));
            results = diceCommands[firstWord](num, size, msg.author.username);
            const length = Object.keys(results).length;

            for (let i = 0; i < length - 1; i++) {
                response += `Die ${i+1}: ${results[i]}\n`
                console.log(response);
            }

            response += `Result: ${results["result"]}`;

            msg.reply(response);
        }
        if (otherCommands[firstWord]) {
            console.log("Not Dice Command");
            response = otherCommands[firstWord](user);
            const length = Object.keys(response).length;

            const embed = new Discord.RichEmbed().setTitle("Help").setColor(3447003).setDescription("This is a list of commands as well as examples of how to use them.").setTimestamp();
            
            for(let i = 0; i < length; i++) {
                embed.addField(response[i]['name'], response[i]['desc'] + `\nExample: ${response[i]['usage']}`);
            }
            msg.channel.send({embed});
        }
    }
});

client.login('MzcxMTE0NTg2Nzk2OTgyMjc2.DrwcKg.4l2dnMT0B_clo7xKXTNT_LDLl8s');
