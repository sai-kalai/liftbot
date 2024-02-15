



const { Botkit, BotkitConversation} = require('botkit');

//const controller = new Botkit(MY_CONFIGURATION);
const bot = new Botkit();

bot.hears('hello','direct_message', function(bot, message) {
    bot.reply(message,'Hello yourself!');
});
