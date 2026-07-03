const BOT_TOKEN = "8848375289:AAFc73QTQZQoYBxyVSb2ML3FgB8sODmwmW0";
const CHAT_ID = "@billboardarabia";

// داده‌های تصادفی برای ساخت خبر
const artists = [
  "عمرو دياب", "إليسا", "سعد لمجرد",
  "نانسي عجرم", "محمد رمضان",
  "تامر حسني", "بلقيس", "أصيل هميم"
];

const platforms = ["تيك توك", "يوتيوب", "سبوتيفاي", "إنستغرام ريلز"];

const actions = [
  "تصدر الترند على",
  "أصبح في صدارة",
  "يحقق انتشاراً واسعاً على",
  "يقتحم قوائم النجاح في"
];

const insights = [
  "يشهد هذا العمل الموسيقي نمواً سريعاً في المشاهدات خلال آخر 24 ساعة.",
  "تزايد التفاعل بشكل كبير من الجمهور العربي والعالمي.",
  "يتم تداوله بشكل واسع عبر منصات التواصل الاجتماعي.",
  "أصبح من أكثر الأغاني تداولاً اليوم في المنطقة العربية."
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNews() {
  const artist = pick(artists);
  const platform = pick(platforms);
  const action = pick(actions);
  const insight = pick(insights);

  return {
    title: `🔥 ${artist} ${action} ${platform}`,
    body: insight
  };
}

async function send() {
  const news = generateNews();

  const text =
`🎶 ${news.title}

🎧 التحليل:
${news.body}

📊 الحالة:
يعكس هذا الاتجاه النمو السريع للموسيقى العربية على المنصات الرقمية مثل تيك توك ويوتيوب وسبوتيفاي.

🔥 التوجه العام:
زيادة انتشار الأغاني العربية عالمياً وارتفاع التفاعل خلال آخر 24 ساعة.

#موسيقى_عربية #أغاني_عربية #ترند #تيك_توك #يوتيوب #سبوتيفاي #ArabicMusic #Trending #Viral #Music`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text
    })
  });
}

send();
