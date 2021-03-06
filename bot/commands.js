const random = require('random');
const Discord = require('discord.js');
const oldschooljs = require('oldschooljs');

const bannedUsers = {

};

const adminUsers = {
    // Ian
    '251911037178085376': 'Praise Ian or perish... (/◕ヮ◕)/',
    // The bot
    '371114586796982276': "I'm a... master? (ʘдʘ╬)"
};

/* NICK FUNCTIONS*/
const NickID = '251911242824941569';
let currentMonster = null;
let nickPoints = 0;
let currentBounty = 0;

const nickLeaving = (client) => {
    let response = `Where do you think you're going? Who's gonna kill this ${currentMonster}!? (۶ᵒ̌▱๋ᵒ̌ )۶`
    if (currentMonster === null) {
        let response = `He's earned his leave... (´◉◞౪◟◉)`;
    } else if (nickPoints === 1000) {
        if (!bannedUsers['225430614260711424']) {
            return ban('225430614260711424', '251911037178085376', client);
        }
    }

    return response;
}

const confirmKill = (author, client) => {
    let response = `${`<@${NickID}>`} has no monster set.`;
    if (!adminUsers[author]) {
        return 'You\'re not a questgiver! <(｀^´)>';
    }

    currentMonster = null;
    nickPoints += currentBounty;
    currentBounty = 0;

    response = `${`<@${NickID}>`} has slain ${currentMonster} for ${currentBounty} points! He's now at ${nickPoints}. ☜(˚▽˚)☞`;

    return response;
};

const confirmKillMeta = () => {
    const meta = {
        name: '!confirmkill',
        desc: 'Confirms that Nick killed his monster.',
        usage: '!confirmkill',
    };

    return meta;
};

const setMonster = (author, client) => {
    let response = `${`<@${NickID}>`} already has ${currentMonster} for ${currentBounty} points! ⋋_⋌`;
    if (!adminUsers[author]) {
        return 'You\'re not a questgiver! <(｀^´)>';
    } else if (currentMonster != null) {
        return response;
    }

    const monster_keys = Object.keys(oldschooljs.Monsters);
    const monster_key = monster_keys[Math.floor(Math.random() * monster_keys.length)];

    currentMonster = oldschooljs.Monsters[monster_key].name;
    currentBounty = 1;

    response = `${`<@${NickID}>`} has been assigned ${currentMonster} for ${currentBounty} points! He's at ${nickPoints}. ☜(˚▽˚)☞`;

    return response;
};

const setMonsterMeta = () => {
    const meta = {
        name: '!setmonster',
        desc: 'Gives Nick a monster in OSRS to kill',
        usage: '!setmonster',
    };

    return meta;
};

const reroll = (author, client) => {
    let response = `${`<@${NickID}>`} has no monster set.`;
    if (!adminUsers[author]) {
        return 'You\'re not a questgiver! <(｀^´)>';
    } else if (currentMonster != null) {
        response = `${`<@${NickID}>`} has given up on ${currentMonster} and ${currentBounty} points.`;
        currentMonster = null;
        currentBounty = null;
    }

    return `${response}\n${setMonster(author, client)}`;
};

const rerollMeta = () => {
    const meta = {
        name: '!reroll',
        desc: 'Gives Nick a new monster in OSRS to kill. Usually this costs 5 points, but you can be generous. Use the modify points command to adjust his points',
        usage: '!reroll',
    };

    return meta;
};

const setBounty = (author, num, client) => {
    let response = `${`<@${NickID}>`}\'s bounty for some reason can\'t be changed.`;
    if (!adminUsers[author]) {
        return 'You\'re not a questgiver! <(｀^´)>';
    } else if (isNaN(num)) {
        response = 'Passed in number must be a whole number. Example: -1, 0, 1, 2..';
        return response;
    }

    currentBounty += num;
    response = `${`<@${NickID}>`}'s ${currentMonster} is now worth ${currentBounty} points! He's now at ${nickPoints}. ☜(˚▽˚)☞`;
};

const setBountyMeta = () => {
    const meta = {
        name: '!setbounty',
        desc: 'Gives or takes away Nick\'s points from Nick\'s bounty by X. Use a negative number to take away points.',
        usage: '!setbounty X',
    };

    return meta;
};

const modifyPoints = (author, num, client) => {
    let response = `${`<@${NickID}>`}\'s points for some reason can\'t be changed.`;
    if (!adminUsers[author]) {
        return 'You\'re not a questgiver! <(｀^´)>';
    } else if (isNaN(num)) {
        response = 'Passed in number must be a whole number. Example: -1, 0, 1, 2..';
        return response;
    }

    nickPoints += num;
    if (nickPoints < 0) {
        nickPoints = 0;
    }
    response = `${`<@${NickID}>`} is now at ${nickPoints} points.`;
    return response;
};

const modifyPointsMeta = () => {
    const meta = {
        name: '!modifypoints',
        desc: 'Gives or takes away Nick\'s points by X. Use a negative number to take away points.',
        usage: '!modifypoints X',
    };

    return meta;
};

const getStats = (author, client) => {
    let response;
    if (currentMonster != null) {
        response = `${`<@${NickID}>`}'s current current monster is ${currentMonster} which is worth ${currentBounty} points. He has ${nickPoints} points.`;
    } else {
        response = `${`<@${NickID}>`} has ${nickPoints} points.`;
    }

    return response;
};

const getStatsMeta = () => {
    const meta = {
        name: '!stats',
        desc: 'Gets Nick\'s current monster, bounty, and points.',
        usage: '!stats',
    };

    return meta;
};
/* NICK FUNCTIONS ENDS*/
const RollDice = (user, num, size, mod) => {
    // console.log(mod);

    const result = {
        result: 0,
    };

    if (bannedUsers[user]) {
        result.result = bannedUsers[user];

        return result;
    }

    if (isNaN(num) || isNaN(size)) {
        result.result = 'Passed in number and size values must be whole numbers. Example: 1d12+0';
        return result;
    } else if (num < 1 || num > 20 || size <= 1 || size > 100 || mod < -20 || mod > 20) {
        result.result = 'Invalid size or number. Format Example: XdY+Z where X is 1-20, Y is 2-100, and Z is -20 - 20';
        return result;
    }

    for (let i = 0; i < num; i++) {
        const randomResult = random.int(1, size);
        result[i] = randomResult;
        result.result += result[i];
        // console.log(result);
    }
    result.result += mod;
    // console.log(result);
    return result;
};

const rollDiceMeta = () => {
    const meta = {
        name: '!roll',
        desc: 'Gets the total of rolling X die of Y size with a modifier of Z',
        usage: '!roll XdY+Z',
    };

    return meta;
};

const RollHighest = (user, num, size, mod) => {
    const result = {
        result: 0,
    };

    if (bannedUsers[user]) {
        result.result = bannedUsers[user];

        return result;
    }

    if (isNaN(num) || isNaN(size)) {
        result.result = 'Passed in number and size values must be whole numbers. Example: 1d12+0';
        return result;
    } else if (num < 1 || size <= 1 || num > 20 || size > 100 || mod < -10 || mod > 10) {
        result.result = 'Invalid size or number. Format Example: XdY+Z where X is 1-20, Y is 2-100, and Z is -10 - 10';
        return result;
    }

    for (let i = 0; i < num; i++) {
        const randomResult = random.int(1, size) + mod;
        result[i] = randomResult;
        if (result[i] > result.result) {
            result.result = result[i];
        }
    }

    return result;
};

const rollHighestMeta = () => {
    const meta = {
        name: '!highest',
        desc: 'Gets the highest roll of X die of Y size and a modifier of Z',
        usage: '!highest XdY+Z',
    };

    return meta;
};

const createCustomMeta = (user, purpose) => {
    const meta = {
        name: '!create',
        desc: "Creates/Overwrites a custom function that you can reuse by invoking its' name",
        usage: '!create name XdY+Z (reused by typing !name)',
    };

    return meta;
};

const removeCustomMeta = (user, purpose) => {
    const meta = {
        name: '!remove',
        desc: 'Removes a custom function',
        usage: '!remove fireball (without an "!")',
    };

    return meta;
};

const commandsMeta = (user, purpose) => {
    const meta = {
        name: '!commands',
        desc: 'Lists all your custom commands',
        usage: '!commands',
    };

    return meta;
};

const ban = (user, author, client) => {
    let response = "They've already been taken care of. (✿◠‿◠)";
    if (!adminUsers[author]) {
        return 'You\'re not my master! <(｀^´)>';
    } else if (!client.users.find('id', user)) {
        response = 'Invalid username';
    } else if (bannedUsers[user]) {
        response = 'That person is already banned!';
    } else if (user === '251911037178085376') {
        response = 'I will not ban my creator!';
    } else {
        bannedUsers[user] = `No more bad touch, ${`<@${user}>`}! (╬ ಠ益ಠ)`;
        if (adminUsers[user]) {
            delete adminUsers[user];
        }
        response = `No more bad touch, ${`<@${user}>`}! (╬ ಠ益ಠ)`;
    }

    return response;
};

const banMeta = () => {
    const meta = {
        name: '!ban',
        desc: 'Stops a person from rolling. Use this by mentioning the user.',
        usage: '!ban @mention',
    };

    return meta;
};

const unban = (user, author, client) => {
    let response = 'You were already able to roll me! (╬ ಠ益ಠ)';
    if (!adminUsers[author]) {
        return 'You\'re not my master! <(｀^´)>';
    } else if (!client.users.find('id', user)) {
        response = 'Invalid username';
    } else if (!bannedUsers[user]) {
        response = 'That person is already unbanned!';
    } else {
        delete bannedUsers[user];
        response = `You can roll me now, ${`<@${user}>`}... (´･ω･\`)`;
    }

    return response;
};

const unbanMeta = () => {
    const meta = {
        name: '!unban',
        desc: 'Allows a person to person to rolling.',
        usage: '!unban @mention',
    };

    return meta;
};

const banList = () => {
    let response = 'No one has been purged yet! owo';
    if (Object.keys(bannedUsers).length > 0) {
        response = '\nThose currently purged:';
        const keys = Object.keys(bannedUsers);
        for (let i = 0; i < keys.length; i++) {
            response += `\n${`<@${keys[i]}>`}`;
        }
    }

    return response;
};

const banListMeta = () => {
    const meta = {
        name: '!banlist',
        desc: "View who's been purged... ;_;",
        usage: '!banlist',
    };

    return meta;
};

const admin = (user, author, client) => {
    let response = "They've already been taken care of. (✿◠‿◠)";
    if (!adminUsers[author]) {
        return 'You\'re not my master! <(｀^´)>';
    } else if (!client.users.find('id', user)) {
        response = 'Invalid username';
    } else if (adminUsers[user]) {
        response = 'That person has already arisen!';
    } else {
        if (bannedUsers[user]) {
            delete bannedUsers[user];
        }
        adminUsers[user] = `Praise ${`<@${user}>`} or perish... (/◕ヮ◕)/`;
        response = `Praise ${`<@${user}>`} or perish... (/◕ヮ◕)/`;
    }

    return response;
};

const unadmin = (user, author, client) => {
    let response = 'You were already able to roll me! (╬ ಠ益ಠ)';
    if (!adminUsers[author]) {
        return 'You\'re not my master! <(｀^´)>';
    } else if (!client.users.find('id', user)) {
        response = 'Invalid username';
    } else if (!adminUsers[user]) {
        response = 'That person hasn\'t ascended!';
    } else if (user === '251911037178085376') {
        response = 'I will not harm my creator!';
    } else {
        delete adminUsers[user];
        response = `You have no power here ${`<@${user}>`}.. (╬ ಠ益ಠ)`;
    }

    return response;
};


const adminList = () => {
    let response = 'No one has ascended! (╬ ಠ益ಠ)';
    if (Object.keys(adminUsers).length > 0) {
        response = '\nThose currently ascended:';
        const keys = Object.keys(adminUsers);
        for (let i = 0; i < keys.length; i++) {
            response += `\n${`<@${keys[i]}>`}`;
        }
    }

    return response;
};

const adminListMeta = () => {
    const meta = {
        name: '!adminlist',
        desc: "(/◕ヮ◕)/ View who's been ascended! (/◕ヮ◕)/",
        usage: '!adminlist',
    };

    return meta;
};

const help = () => {
    const results = {
        0: rollHighestMeta(),
        1: rollDiceMeta(),
        2: createCustomMeta(),
        3: removeCustomMeta(),
        4: commandsMeta(),
        5: banMeta(),
        6: unbanMeta(),
        7: banListMeta(),
        8: adminListMeta(),
        9: confirmKillMeta(),
        10: setMonsterMeta(),
        11: rerollMeta(),
        12: setBountyMeta(),
        13: modifyPointsMeta(),
        14: getStatsMeta(),
        embed: true,
    };

    return results;
};

module.exports.RollDice = RollDice;
module.exports.RollHighest = RollHighest;
module.exports.ban = ban;
module.exports.unban = unban;
module.exports.help = help;
module.exports.bannedUsers = bannedUsers;
module.exports.banList = banList;
module.exports.admin = admin;
module.exports.unadmin = unadmin;
module.exports.adminList = adminList;

module.exports.confirmKill = confirmKill;
module.exports.setMonster = setMonster;
module.exports.reroll = reroll;
module.exports.setBounty = setBounty;
module.exports.modifyPoints = modifyPoints;
module.exports.getStats = getStats;
module.exports.nickLeaving = nickLeaving;
