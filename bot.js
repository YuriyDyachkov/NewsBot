const { mainKeyboard, secondKeyboard } = require('./keybords');

const { Telegraf } = require('telegraf');
require('dotenv').config();
const fetch = require('node-fetch');

const bot = new Telegraf(process.env.TOKEN);
bot.use(Telegraf.log());

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
    if (index < 6) {
      const str = `${index + 1}: ${el.title}\n${el.description}\n${el.url}\n\n`;
      news += str;
    }
  });
  ctx.reply(news);
});

bot.help((ctx) => ctx.reply(`Привет, меня зовут Юра. Я сделал данного бота за один день, до этого ничего не зная о телеграм ботах.
Семён сказал, что я красавчик.
Приезжай на Вавилова 1, обыграю тебя в теннис, дружок!`));

/*
1. Обернуть все в трай кетч
2. Реализовать логику где юзер сам может вводить тему (использовать регулярку для валидации запроса)
3. Если останется время. Сделать так, чтобы выводилось по одной новости и была кнопка, которая возвращает к выбору тем.
*/

bot.launch();

/* {
  "update_id": 770982183,
  "callback_query": {
    "id": "1713823524367750603",
    "from": {
      "id": 399030634,
      "is_bot": false,
      "first_name": "Артём",
      "last_name": "Карганян",
      "username": "Karganyan",
      "language_code": "ru"
    },
    "message": {
      "message_id": 550,
      "from": {
        "id": 1535399544,
        "is_bot": true,
        "first_name": "BreakingNews",
        "username": "ElbrusNews_bot"
      },
      "chat": {
        "id": 399030634,
        "first_name": "Артём",
        "last_name": "Карганян",
        "username": "Karganyan",
        "type": "private"
      },
      "date": 1611254984,
      "text": "Привет, Артём!\nДанный бот позволит тебе просматривать самые последние новости за выбранный тобой период.\nВыбери категорию из популярных или введи свою.",
      "reply_markup": {
        "inline_keyboard": [
          [
            {
              "text": "Экономика",
              "callback_data": "Theme_Еconomy"
            },
            {
              "text": "Политика",
              "callback_data": "Theme_Politics"
            },
            {
              "text": "Происшествия",
              "callback_data": "Theme_Incidents"
            }
          ],
          [
            {
              "text": "Технические",
              "callback_data": "Theme_Hi-Tech"
            },
            {
              "text": "Спорт",
              "callback_data": "Theme_Sport"
            },
            {
              "text": "Кино",
              "callback_data": "Theme_Movie"
            }
          ]
        ]
      }
    },
    "chat_instance": "-4471389062030635660",
    "data": "Theme_Еconomy"
  }
}
{
  "update_id": 770982184,
  "callback_query": {
    "id": "1713823524305842899",
    "from": {
      "id": 399030634,
      "is_bot": false,
      "first_name": "Артём",
      "last_name": "Карганян",
      "username": "Karganyan",
      "language_code": "ru"
    },
    "message": {
      "message_id": 566,
      "from": {
        "id": 1535399544,
        "is_bot": true,
        "first_name": "BreakingNews",
        "username": "ElbrusNews_bot"
      },
      "chat": {
        "id": 399030634,
        "first_name": "Артём",
        "last_name": "Карганян",
        "username": "Karganyan",
        "type": "private"
      },
      "date": 1611255685,
      "text": "Ваша тема экономика:",
      "reply_markup": {
        "inline_keyboard": [
          [
            {
              "text": "Последние",
              "callback_data": "Subcategory_relevancy"
            },
            {
              "text": "Популярные",
              "callback_data": "Subcategory_popularity"
            }
          ]
        ]
      }
    },
    "chat_instance": "-4471389062030635660",
    "data": "Subcategory_popularity"
  }
} */
