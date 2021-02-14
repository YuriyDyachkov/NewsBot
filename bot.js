const { mainKeyboard, secondKeyboard, lastKeyboard, errorKeyboard } = require('./keyboards');

const { Telegraf, session, Scenes: { BaseScene, Stage } } = require('telegraf');
// const sanitize = require('sanitize-html');
require('dotenv').config();
const fetch = require('node-fetch');

const stage = new Stage();
const bot = new Telegraf(process.env.TOKEN);
bot.use(session());
bot.use(stage.middleware());

// bot.use(Telegraf.log());

bot.start((ctx) => {
  ctx.reply(`Привет, ${ctx.from.first_name}!
Данный бот позволит тебе просматривать самые последние и актуальные новости.
Выбери категорию из популярных или введи свою.`, {
    reply_markup: {
      inline_keyboard: mainKeyboard,
    },
  });
});

bot.help((ctx) => ctx.reply('Если у тебя есть идеи по улучшению бота или ты столкнулся с какой-либо проблемой, напиши мне на t.me/YuriyDyachkov.'));

bot.hears(/^[a-zA-Zа-яёА-ЯЁ0-9\s]{3,20}$/gi, (ctx) => {
  const theme = ctx.update.message.text.toLowerCase();
  ctx.reply(`Ваша тема ${theme}:`, {
    reply_markup: {
      inline_keyboard: secondKeyboard,
    },
  });
  ctx.session.theme = theme;
});

bot.action('funny', async (ctx) => {
  const ftch = await fetch('https://api.thecatapi.com/v1/images/search?size=full');
  ctx.replyWithPhoto(ftch, errorKeyboard);
  ctx.answerCbQuery();
});

bot.action(/Theme_.+/gi, async (ctx) => {
  // eslint-disable-next-line max-len
  const theme = ctx.update.callback_query.message.reply_markup.inline_keyboard.flat(Infinity).find((el) => el.callback_data === ctx.update.callback_query.data).text.toLowerCase();
  ctx.session.theme = theme;
  await ctx.replyWithHTML(`Ваша тема ${theme}:`, {
    reply_markup: {
      inline_keyboard: secondKeyboard,
    },
  });
  ctx.answerCbQuery();
});

bot.action(/Subcategory_.+/gi, async (ctx) => {
  let sort = '';
  const subcategory = ctx.update.callback_query.data;
  const category = ctx.session.theme;
  if (subcategory === 'Subcategory_relevancy') {
    sort = 'relevancy';
  }
  if (subcategory === 'Subcategory_popularity') {
    sort = 'popularity';
  }
  if (subcategory === 'Subcategory_publishedAt') {
    sort = 'publishedAt';
  }

  const ftch = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(category)}&sortBy=${sort}&apiKey=${process.env.apiKey}&language=ru`);
  const result = await ftch.json();
  if (!result.articles.length) {
    await ctx.reply('Упс, не получилось обработать запрос. Перефразируй тему или выбери другую.', errorKeyboard);
    await ctx.answerCbQuery();
  } else {
    const news = [];
    result.articles?.forEach((el, index) => {
      const str = `${index + 1}: <b>${el.title}</b>\n${el.description}\n${el.url}\n\n`;
      news.push(str);
    });
    ctx.session.res = news;
    const newsWithHtml = ctx.session.res.shift();
    try {
      await ctx.replyWithHTML(newsWithHtml, lastKeyboard);
      await ctx.answerCbQuery();
    } catch (error) {
      await ctx.reply(newsWithHtml.replace(/(<\/…)|(<b>)|(<\/b>)|(<ol>)|(<\/li>)|(<\/ol>)|(<li>)|(<ul>)|(<\/ul>)/gi, ''), lastKeyboard);
      ctx.answerCbQuery();
    }
  }
});

bot.action(['next', 'back'], async (ctx) => {
  if (ctx.update.callback_query.data === 'next') {
    if (ctx.session?.res.length) {
      const newsWithHtml = ctx.session.res.shift();
      try {
        await ctx.replyWithHTML(newsWithHtml, lastKeyboard);
        ctx.answerCbQuery();
      } catch (error) {
        try {
          await ctx.replyWithHTML(newsWithHtml.replace(/(<ol>)|(<\/li>)|(<\/ol>)|(<li>)|(<ul>)|(<\/ul>)/gi, ''), lastKeyboard);
          ctx.answerCbQuery();
        } catch (err) {
          await ctx.reply(newsWithHtml.replace(/(<\/…)|(<b>)|(<\/b>)|(<ol>)|(<\/li>)|(<\/ol>)|(<li>)|(<ul>)|(<\/ul>)/gi, ''), lastKeyboard);
          ctx.answerCbQuery();
        }
      }
    } else {
      ctx.reply(`${ctx.from.first_name}, ты посмотрел все новости на сегодня по данной теме.`, {
        reply_markup: {
          inline_keyboard: mainKeyboard,
        },
      });
      ctx.answerCbQuery();
    }
  }
  if (ctx.update.callback_query.data === 'back') {
    ctx.replyWithHTML(`${ctx.from.first_name}, выбери тему или введи свою.`, {
      reply_markup: {
        inline_keyboard: mainKeyboard,
      },
    });
    ctx.answerCbQuery();
  }
});

bot.on('message', (ctx) => {
  ctx.reply('Введи корректное название темы. Оно может начинаться с любых символов, длина запроса ограничена 20. Если ты написал что то плохое, то сам такой.');
});

bot.launch();
