/* song.js - GoatBot V2 /song command handler */

const ytdl = require('ytdl-core');

module.exports = (bot, botUsername) => {
  // Handle /song command in groups and private chats
  // Use regex to match /song and optional @BotUsername
  const cmdRegex = new RegExp(`\\/song(?:@${botUsername})?\\s+(.+)`, 'i');

  bot.onText(cmdRegex, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[1].trim();

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return bot.sendMessage(chatId, 'দয়া করে একটি বৈধ YouTube URL দিতে বলো।');
    }

    try {
      // Get video info for title
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, '');

      // Stream audio only
      const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });

      // Send audio file
      await bot.sendAudio(chatId, stream, {
        title: title,
        performer: 'GoatBot V2'
      }, {
        filename: `${title}.mp3`,
        contentType: 'audio/mpeg'
      });
    } catch (err) {
      console.error('Error in /song command:', err);
      bot.sendMessage(chatId, 'দুঃখিত, অডিও ডাউনলোডে সমস্যা হয়েছে। পরে চেষ্টা করো।');
    }
  });
};
