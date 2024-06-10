const TelegramBot = require('node-telegram-bot-api')
const token = 'your-telegram-token'
const { gameOptions, gameWrongOption } = require('./options')

const bot = new TelegramBot(token, { polling: true })
const obj = {}

const startGame = async chatID => {
  await bot.sendMessage(chatID, "Kompyuter 0 dan 10 gacha bo'lgan son o'yladi, nechchi raqam ekanligini topa olasizmi?")
  const randomNumber = Math.floor(Math.random() * 10)
  console.log('randomNumber: ', randomNumber)
  obj[chatID] = randomNumber
  await bot.sendMessage(chatID, "To'g'ri sonni tanlang:", gameOptions)
}
// bot.setMyCommands([
//   {
//     command: '/start',
//     description: 'Botni ishga tushirish'
//   },
//   {
//     command: '/info',
//     description: 'what is this bot for'
//   },
//   {
//     command: '/sendpicture',
//     description: 'picture of nice weather'
//   }
// ])

const startup = () => {
  bot.on('message', async data => {
    const chatID = data.chat.id
    const text = data.text

    if (text === 'start' || text === '/start') {
      await bot.sendMessage(chatID, `Assalomu aleykum ${data.from.first_name} @${data.from?.username} , Botimizga xush kelibsiz, ko'ring, o'ynang, mezza qiling`)
      return bot.sendMessage(chatID, 'Buyruqlarni tanlang', {
        "reply_markup": {
          "keyboard": [['game', 'sendpicture'],]
        }
      })
    }

    if (text === 'info') {
      return bot.sendVideo(chatID, 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjNwMGN6NHdxbDh1dzY4bHl1cWV5ZXQ5b3h3emIxNHV2cXJmZTJ1cyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8FxaYF4jKVytcumRS8/giphy.gif', { caption: 'Jprq boti sizga mahsulotlarni yetkazib berishda yordam beradi' })
    }
    if (text === 'sendpicture') {
      return bot.sendPhoto(chatID, 'https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=1804&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', { caption: 'There it is, a nice weather picture' })
    }
    if (text === 'game') {
      return startGame(chatID)
    }


    bot.sendMessage(chatID, "Oh, I don't know")
  })
  bot.on("callback_query", msg => {
    const data = msg.data
    const chatID = msg.message.chat.id
    if (+data === obj[chatID]) {
      console.log(data, obj[chatID])
      return bot.sendMessage(chatID, `Qoyil, siz to'g'ri javob berdingiz, kompyuter ${obj[chatID]} sonini tanlagan edi, siz ${data} sonini tanladingiz`)
    }
    if (data === '/again') {
      return startGame(chatID)
    }
    return bot.sendMessage(chatID, 'Adashdingiz', gameWrongOption)
  })
}

startup()