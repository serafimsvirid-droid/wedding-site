import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = "8895972326:AAGdh6EhcZaWSTZsZ9eohtSH8qstL2KLMRc";
const TELEGRAM_CHAT_ID = "692436488";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    let message = `🎉 Новый ответ!\nСтатус: ${body.attendance === "yes" ? "Придёт" : "Не придёт"}\n`;
    if (body.attendance === "yes") {
      message += `Гости: ${body.guests?.join(", ") || "-"}\nЕда: ${body.food || "-"}\nАлкоголь: ${body.alcohol?.join(", ") || "-"}`;
    } else {
      message += `Имя: ${body.noName || "-"}\nEmail: ${body.noEmail || "-"}\nПричина: ${body.reason || "-"}`;
    }

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}