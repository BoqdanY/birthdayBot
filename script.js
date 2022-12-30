'use strict';

const { Telegraf } = require('telegraf');
const data = require('./data.json'); //file with your data

const BOT_TOKEN = 'Your token';
const bot = new Telegraf(BOT_TOKEN);

bot.telegram.setMyCommands(
    [
      {
        "command": "nextbirthday",
        "description": "Наступне день народження",
      },
    ],
);

bot.start((ctx) => {
    ctx.reply('I am working...');

    const tomorrow = new Date;
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 5, 0, 0);
    const time = Date.parse(tomorrow) - Date.now();

    setTimeout(() => {
        setInterval(() => todayBirthday(ctx), 86400000);
    }, time);
})

bot.command('nextbirthday', ctx => nextBirthday(ctx));

function nextBirthday(ctx) {
    const currentDate = new Date();
    const curerentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    let persons;

    let arr = data.filter((elem) => Number(elem.date.split('.')[1]) === curerentMonth && Number(elem.date.split('.')[0]) > currentDay || Number(elem.date.split('.')[1]) > curerentMonth);
    
    if (arr.length !== 0) {
        persons = minDate(arr);
    } else {
        persons = minDate(data);
    }
    
    for (const person of persons) {
        ctx.reply(`${person.name} буде святкувати свій День народження ${person.date}.`);
    }
}

function minDate(arr) {
    let curMonth = 13;
    let curDay = 32;
    let res;

    for (const elem of arr) {
        const elemSplited = elem.date.split('.');
        const elemDay = Number(elemSplited[0]);
        const elemMonth = Number(elemSplited[1]);
        
        if (elemMonth <= curMonth) {
            if (elemMonth === curMonth) {
                if (elemDay === curDay) {
                    res.push(elem);
                    curMonth = elemMonth;
                    curDay = elemDay;
                } else if (elemDay < curDay) {
                    res = [elem];
                    curMonth = elemMonth;
                    curDay = elemDay;
                }
            } else {
                res = [elem];
                curMonth = elemMonth;
                curDay = elemDay;
            }
        }
    }

    return res;
}

function todayBirthday(ctx) {
    const currentDate = new Date();
    const curerentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    for (const elem of data) {
        const elemSplited = elem.date.split('.');
        const elemDay = Number(elemSplited[0]);
        const elemMonth = Number(elemSplited[1]);

        if (curerentMonth === elemMonth && currentDay === elemDay) {
            ctx.reply(`${elem.name} святкує сьогодні день народження. Привітаймо @${elem.tag}😘`);
        }
    }
}

bot.launch();