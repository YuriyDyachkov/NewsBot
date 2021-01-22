const { Markup } = require('telegraf');

const mainKeyboard = [
  [{
    text: 'Экономика',
    callback_data: 'Theme_Еconomy',
  },
  {
    text: 'Политика',
    callback_data: 'Theme_Politics',
  },
  {
    text: 'Происшествия',
    callback_data: 'Theme_Incidents',
  }],
  [{
    text: 'Технические',
    callback_data: 'Theme_Hi-Tech',
  },
  {
    text: 'Спорт',
    callback_data: 'Theme_Sport',
  },
  {
    text: 'Кино',
    callback_data: 'Theme_Movie',
  }],
  [{
    text: 'Если прочитанное было плохим',
    callback_data: 'funny',
  }],
];

const secondKeyboard = [
  [{
    text: '?Релевантные?',
    callback_data: 'Subcategory_relevancy',
  },
  {
    text: 'Популярные',
    callback_data: 'Subcategory_popularity',
  },
  {
    text: 'Последние',
    callback_data: 'Subcategory_publishedAt',
  },
  ],
];

const lastKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('Следующая', 'next'),
  Markup.button.callback('Вернуться', 'back'),
]);

const errorKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('Вернуться', 'back'),
]);

module.exports = { mainKeyboard, secondKeyboard, lastKeyboard, errorKeyboard };
