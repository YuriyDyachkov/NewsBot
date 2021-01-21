const { mainKeyboard, secondKeyboard } = require('./keybords');

const { Telegraf } = require('telegraf');
require('dotenv').config();
const fetch = require('node-fetch'); // позволит сделать запрос на АПИ

const bot = new Telegraf(process.env.TOKEN);
// bot.use(Telegraf.log());

bot.start((ctx) => {
  ctx.reply(` Привет, ${ctx.from.first_name}!
Данный бот позволит тебе просматривать самые последние новости за выбранный тобой период.
Выбери категорию из популярных или введи свою.`, {
    reply_markup: {
      inline_keyboard: mainKeyboard,
    },
  });
});

bot.action(/Theme_.+/gi, (ctx) => {
  // eslint-disable-next-line max-len
  const theme = ctx.update.callback_query.message.reply_markup.inline_keyboard.flat(Infinity).find((el) => el.callback_data === ctx.update.callback_query.data).text.toLowerCase();

  ctx.reply(`Ваша тема ${theme}:`, {
    reply_markup: {
      inline_keyboard: secondKeyboard,
    },
  });
});

bot.action(/Subcategory_.+/gi, async (ctx) => {
  let sort = '';
  const subcategory = ctx.update.callback_query.data;
  const category = ctx.update.callback_query.message.text.split(' ')[2].replace(/:/i, '');

  if (subcategory === 'Subcategory_relevancy') {
    sort = 'relevancy';
  }
  if (subcategory === 'Subcategory_popularity') {
    sort = 'popularity';
  }

  const ftch = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(category)}&sortBy=${sort}&apiKey=${process.env.apiKey}&language=ru`);
  const result = await ftch.json();
  let news = '';
  result.articles.forEach((el, index) => {
    if (index < 5) {
      const str = `${index + 1}: ${el.title}\n${el.description}\n${el.url}\n\n`;
      news += str;
    }
  });
  ctx.reply(news);
});

bot.help((ctx) => ctx.reply('!!!')); // не забыть написать в самом конце

bot.launch();
