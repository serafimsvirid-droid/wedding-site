import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = "8895972326:AAGdh6EhcZaWSTZsZ9eohtSH8qstL2KLMRc";
const TELEGRAM_CHAT_ID = "692436488";

export async function POST(request: Request) {
  try {
    // 1. Получаем данные из формы
    const body = await request.json();
    console.log("Получены данные:", body);

    // 2. Формируем красивое сообщение для Telegram
    let message = `🎉 <b>НОВЫЙ ОТВЕТ RSVP!</b>\n\n`;
    message += `📌 <b>Статус:</b> ${body.attendance === "yes" ? "✅ ПРИДУ" : "❌ НЕ ПРИДУ"}\n\n`;

    if (body.attendance === "yes") {
      message += `👥 <b>Гости:</b> ${body.guests?.filter((g: string) => g).join(", ") || "Не указано"}\n`;
      message += `🍽 <b>Еда:</b> ${body.food || "Не указано"}\n`;
      message += `🍷 <b>Алкоголь:</b> ${body.alcohol?.join(", ") || "Не указано"}\n`;
      message += `✏️ <b>Свой алкоголь:</b> ${body.customAlcohol || "Нет"}\n`;
      message += `🚗 <b>Трансфер:</b> ${body.transfer || "Не указано"}\n`;
      message += `🅿️ <b>Парковка:</b> ${body.parking || "Не указано"}\n`;
      message += `💬 <b>Пожелания:</b> ${body.wishes || "Нет"}\n`;
      message += `📧 <b>Email:</b> ${body.email || "Не указан"}`;
    } else {
      message += `🙋‍♂️ <b>Имя:</b> ${body.noName || "Не указано"}\n`;
      message += `📧 <b>Email:</b> ${body.noEmail || "Не указан"}\n`;
      message += `📝 <b>Причина:</b> ${body.reason || "Не указана"}`;
    }

    // 3. Отправляем сообщение в Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const tgResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!tgResponse.ok) {
      const errorText = await tgResponse.text();
      console.error("Ошибка Telegram:", errorText);
      return NextResponse.json({ success: false, error: "Telegram API error" }, { status: 500 });
    }

    // 4. Всё успешно
    return NextResponse.json({ success: true, message: "Ответ успешно отправлен!" });

  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}