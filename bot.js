import axios from "axios";
import config from "./config.js";

// گرفتن خبر واقعی موسیقی عربی
async function getNews() {
  const url = `https://gnews.io/api/v4/search?q=music arabic OR arabic song&lang=ar&max=1&token=${config.GNEWS_API_KEY}`;
  const res = await axios.get(url);
  return res.data.articles[0];
}

// تولید متن عربی با AI
async function generateText(article) {
  const prompt = `
اكتب منشور أخبار موسيقى عربي احترافي:

العنوان: ${article.title}
الوصف: ${article.description}

اكتب بأسلوب إعلامي جذاب + تحليل + هاشتاغات في النهاية.
`;

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: {
        Authorization: `Bearer ${config.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.choices[0].message.content;
}

// ارسال به تلگرام
async function sendToTelegram(text, imageUrl) {
  const url = `https://api.telegram.org/bot${config.BOT_TOKEN}/sendPhoto`;

  await axios.post(url, {
    chat_id: config.CHAT_ID,
    photo: imageUrl,
    caption: text
  });
}
async function run() {
  const article = await getNews();
  const post = await generateText(article);
  await sendToTelegram(post);
}

run();
