const random = require('random');

const bannedUsers = {
    "PoloSpankin": "Please don't touch me. Not the bad touch. >o<",
};

const RollDice = (num, size, user) => {
    let result = {
        "result": 0,
    };

    if (bannedUsers[user]) {
        result["result"] = bannedUsers[user];

        return result;
    }

    if (num < 1 || size < 1 || num > 20) {
        result["result"] = "\nInvalid size or number. Format Example: XdY where X is 1-20 and Y is greater than 1";
        return result;
    }

    for (let i = 0; i < num; i++) {
        let randomResult = random.int(1, size);
        result[i] = randomResult;
        result["result"] += randomResult;
    }

    console.log(result);
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

const RollHighest = (num, size, user) => {
    let result = {
        "result": 0,
    };

    if (num < 1 || size < 1 || num > 20) {
        result["result"] = "Invalid size or number. Format Example: XdY where X is 1-20 and Y is greater than 1";

        return result;
    }

    if (bannedUsers[user]) {
        result["result"] = bannedUsers[user];

        return result;
    }

    console.log(`Successfully called: ${num} ${size}`);

    for (let i = 0; i < num; i++) {
        let randomResult = random.int(1, size);
        result[i] = randomResult;
        if (randomResult > result["result"]) {
            result["result"] = randomResult;
        }
    }

    console.log(result);
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

const help = (user) => {
    let results = {
        0: RollHighestMeta(),
        1: RollDiceMeta(),
    };
    
    return results;
};

module.exports.RollDice = RollDice;
module.exports.RollHighest = RollHighest;
module.exports.help = help;
module.exports.bannedUsers = bannedUsers;
