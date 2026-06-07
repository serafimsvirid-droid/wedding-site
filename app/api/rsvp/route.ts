import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = "8895972326:AAGdh6EhcZaWSTZsZ9eohtSH8qstL2KLMRc";
const TELEGRAM_CHAT_ID = "692436488";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = `
🎉 <b>НОВЫЙ ОТВЕТ RSVP!</b>
━━━━━━━━━━━━━━━━━━━

📌 <b>Статус:</b> ${body.attendance === "yes" ? "✅ ПРИДУ" : "❌ НЕ ПРИДУ"}

${body.attendance === "yes" ? `
👥 <b>Гости:</b> ${body.guests?.filter((g: string) => g).join(", ") || "Не указано"}

🍽 <b>Еда:</b> ${body.food || "Не указано"}

🍷 <b>Алкоголь:</b> ${body.alcohol?.join(", ") || "Не указано"}

✏️ <b>Свой алкоголь:</b> ${body.customAlcohol || "Нет"}

🚗 <b>Трансфер:</b> ${body.transfer || "Не указано"}

🅿️ <b>Парковка:</b> ${body.parking || "Не указано"}

💬 <b>Пожелания:</b> ${body.wishes || "Нет"}

📧 <b>Email:</b> ${body.email || "Не указан"}
` : `
🙋‍♂️ <b>Имя:</b> ${body.noName || "Не указано"}

📧 <b>Email:</b> ${body.noEmail || "Не указан"}

📝 <b>Причина:</b> ${body.reason || "Не указана"}
`}
━━━━━━━━━━━━━━━━━━━
🕐 ${new Date().toLocaleString("ru-RU")}
    `;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}