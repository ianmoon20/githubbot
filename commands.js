const random = require('random');

const bannedUsers = {

};

const RollDice = (user, num, size, modifier) => {
    let result = {
        "result": 0,
    };

    if (bannedUsers[user]) {
        result["result"] = bannedUsers[user];

        return result;
    }

    if (isNaN(num) || isNaN(size)) {
        result["result"] = "Passed in number and size values must be integers";
        return result;

    } else if (num < 1 || size < 1 || num > 20 || size > 100 || modifier > 200 || modifier < -200) {
        result["result"] = "Invalid size or number. Format Example: XdY where X is 1-20, Y is 2-100, and Z is between -200 and 200";
        return result;
    }

    for (let i = 0; i < num; i++) {
        let randomResult = random.int(1, size);
        result[i] = randomResult;
        result["result"] += randomResult;
    }

    return result;
};

const RollDiceMeta = () => {
    let meta = {
        name: "!roll",
        desc: "Gets the total of rolling X die of Y size",
        usage: "!roll 2d20",
    };

    return meta;
};

const RollHighest = (user, num, size, modifier) => {
    let result = {
        "result": 0,
    };

    if (bannedUsers[user]) {
        result["result"] = bannedUsers[user];

        return result;
    }

    if (isNaN(num) || isNaN(size)) {
        result["result"] = "Passed in number and size values must be whole numbers. Example: 1d12";
        return result;

    } else if (num < 1 || size < 1 || num > 20 || size > 100) {
        result["result"] = "Invalid size or number. Format Example: XdY where X is 1-20 and Y is 2-100";
        return result;
    }

    for (let i = 0; i < num; i++) {
        let randomResult = random.int(1, size);
        result[i] = randomResult;
        if (randomResult > result["result"]) {
            result["result"] = randomResult;
        }
    }

    return result;
};

const RollHighestMeta = () => {
    let meta = {
        name: "!highest",
        desc: "Gets the highest roll of X die of Y size",
        usage: "!highest 2d20",
    };

    return meta;
};

const ban = (user, author, client) => {
    let response = "He's already been taken care of. -o-";

    if (!bannedUsers[user] && client.users.find(user => user.username == `${user}`)) {
        if (author != "Ian") {
            return `You're not my master! >o<`;
        }

        bannedUsers[user] = `No more bad touch, ${user}! >o<`;
        response = `No more bad touch, ${user}! >o<`;
    }

    return response;
};

const banMeta = () => {
    let meta = {
        name: "!ban",
        desc: "Stops a person from rolling.",
        usage: "!ban Name",
    };

    return meta;
};

const unban = (user, author, client) => {
    let response = `You were already able to roll me! >o<`;
    if (bannedUsers[user] && client.users.find(user => user.username == `${user}`)) {
        if (author != "Ian") {
            return `You're not my master! >o<`;
        }
        delete bannedUsers[user];
        response = `You can roll me now, ${user}... owo`;
    }

    return response;
};

const unbanMeta = () => {
    let meta = {
        name: "!unban",
        desc: "Allows a person to person to rolling.",
        usage: "!unban Name",
    };

    return meta;
};

const banList = () => {
    let response = "No one has been purged yet! owo";
    if (Object.keys(bannedUsers).length > 0) {
        response = "\nThose currently purged:"
        const keys = Object.keys(bannedUsers); 
        for (let i = 0; i < keys.length; i++) {
            response += `\n${keys[i]}`;
        }
    }
    
    return response;
};

const banListMeta = () => {
    let meta = {
        name: "!banlist",
        desc: "View who's been purged... ;_;",
        usage: "!banlist",
    };

    return meta;
};

const help = () => {
    let results = {
        0: RollHighestMeta(),
        1: RollDiceMeta(),
        2: banMeta(),
        3: unbanMeta(),
        4: banListMeta(),
        'embed': true,
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
