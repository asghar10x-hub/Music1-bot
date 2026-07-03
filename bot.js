import axios from "axios";
import config from "./config.js";

// گرفتن خبر
async function getNews() {
  const url = `https://gnews.io/api/v4/search?q=arabic%20music&lang=ar&max=1&token=${config.GNEWS_API_KEY}`;
  const res = await axios.get(url);

  const articles = res.data?.articles;

  if (!articles || articles.length === 0) {
    console.log("No articles found");
    return null;
  }

  return articles[0];
}

// تولید متن عربی با AI
async function generateText(article) {
  if (!article || !article.title) {
    throw new Error("Invalid article");
  }

  const prompt = `
اكتب منشور احترافي عن خبر موسيقي عربي بأسلوب إعلامي مثل Billboard Arabia:

العنوان: ${article.title || ""}
الوصف: ${article.description || ""}

النص يجب أن يكون:
- باللغة العربية
- احترافي وجذاب
- تحليل بسيط
- مع هاشتاغات في النهاية
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

// ارسال به تلگرام (عکس + متن)
async function sendToTelegram(text, imageUrl) {
  if (imageUrl) {
    await axios.post(
      `https://api.telegram.org/bot${config.BOT_TOKEN}/sendPhoto`,
      {
        chat_id: config.CHAT_ID,
        photo: imageUrl,
        caption: text
      }
    );
  } else {
    await axios.post(
      `https://api.telegram.org/bot${config.BOT_TOKEN}/sendMessage`,
      {
        chat_id: config.CHAT_ID,
        text: text
      }
    );
  }
}

// اجرای اصلی
async function run() {
  try {
    const article = await getNews();

    if (!article) {
      console.log("No article, skipping run");
      return;
    }

    const post = await generateText(article);

    const image =
      article.image ||
      article.urlToImage ||
      null;

    await sendToTelegram(post, image);

    console.log("Post sent successfully");
  } catch (err) {
    console.error("BOT ERROR:", err.message);
  }
}

run();
