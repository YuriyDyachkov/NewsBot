const mainKeyboard = [
  [{
    text: 'Экономика',
    callback_data: 'Theme_Еconomy',
  },
  {
    text: 'Политика',
    callback_data: 'Theme_Politics',
  }],
  [{
    text: 'Технические',
    callback_data: 'Theme_Hi-Tech',
  },
  {
    text: 'Спорт',
    callback_data: 'Theme_Sport',
  },
  ],
];

const secondKeyboard = [
  [{
    text: 'Последние',
    callback_data: 'Subcategory_relevancy',
  },
  {
    text: 'Популярные',
    callback_data: 'Subcategory_popularity',
  },
  ],
];

module.exports = { mainKeyboard, secondKeyboard };
