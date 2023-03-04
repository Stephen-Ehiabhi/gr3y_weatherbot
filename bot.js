const { Telegraf } = require('telegraf')
const config = require("../weather_bot/config");

const axios = require('axios')

const botToken = process.env.TOKEN
const apikey = process.env.APIKEY

const bot = new Telegraf(botToken)

bot.command('start',(ctx)=>{
    const user = ctx.chat.username;
   const message = `Hi ${user}! I'm gr3yBot_weather😎. And i can tell you the weather of any place of you choice. When you use /weather command followed by the city location (e.g /weather lagos)`
   ctx.telegram.sendMessage(ctx.chat.id,message,{
       reply_markup: {
           inline_keyboard: [
               [
                   { text: 'Bot info', callback_data:'info'}
               ]
           ]
       }
   })
})


bot.command('weather', async ctx => {
    const location = ctx.message.text.split(' ')[1]
    const username = ctx.chat.username
try {
    //fecth the weather route
    const res = await axios.get(`http://api.weatherstack.com/current?access_key=${apikey}&query=${location}`)
    const weatherData = res.data
   // console.log(weatherData)
   ctx.telegram.sendMessage(ctx.chat.id,`Here you go, ${username}: 😊🚀`)
     const message = `
       City: ${weatherData.location.name},
Country: ${weatherData.location.country},
Temperature: ${weatherData.current.temperature},
Pressure: ${weatherData.current.pressure},
Weather: ${weatherData.current.weather_descriptions[0]},
Humidity: ${weatherData.current.humidity},
Daytime: ${weatherData.current.is_day}
    `
      ctx.telegram.sendMessage(ctx.chat.id, message)
} catch (error) {
    console.log(error)
    ctx.reply("I'm sorry, but this location cannot be found😪. Check your spelling, or use a more valid location😌/")
  }   
})

bot.action('info',(ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id,'Bot info',{
        reply_markup: {
            keyboard: [
                [
                    { text:'Credits'},
                    { text:'API'}
                ],
                [
                    { text:'Remove keyboard'}
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
})

//bot hears section
bot.hears('Credits',ctx=>{
    ctx.reply('@steevgr3y created this bot')
})

bot.hears('API',ctx=>{
    ctx.reply('www.weatherstack.com')
})


//bot launch section
bot.launch(err => {
     if(err) console.log(`Error connecting to telegram${err}`);
     else console.log('connected to telegram');  
 })
