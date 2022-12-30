'use strict';

const { Telegraf } = require('telegraf');
const data = require('./data.json'); //file with data
const BOT_TOKEN = 'Your token';

function minDate(arr) {
    let curMonth = 13;
    let curDay = 32;
    let res;

    for (const elem of arr) {
        const elemSplited = elem.date.split('.');
        if (Number(elemSplited[1]) <= curMonth) {
            if (Number(elemSplited[1]) === curMonth) {
                if (Number(elemSplited[0]) === curDay) {
                    res.push(elem);
                    curMonth = Number(elemSplited[1]);
                    curDay = Number(elemSplited[0]);
                } else if (Number(elemSplited[0] < curDay)) {
                    res = [elem];
                    curMonth = Number(elemSplited[1]);
                    curDay = Number(elemSplited[0]);
                }
            } else {
                res = [elem];
                curMonth = Number(elemSplited[1]);
                curDay = Number(elemSplited[0]);
            }
        }
    }

    return res;
}

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

function todayBirthday(ctx) {
    const currentDate = new Date();
    for (const elem of data) {
        const elemSplited = elem.date.split('.');
        if (currentDate.getMonth() === Number(elemSplited[1]) && currentDate.getDate() === Number(elemSplited[0])) ctx.reply(`${elem.name} святкує сьогодні день народження. Привітаймо @${elem.tag}😘`);
    }
}

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
    const now = Date.now();
    const tomorrow = new Date;
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 5, 0, 0);
    const time = Date.parse(tomorrow) - now;
    setTimeout(() => {
        setInterval(() => todayBirthday(ctx), 86400000);
    }, time);
})
bot.command('nextbirthday', ctx => nextBirthday(ctx));
bot.launch();