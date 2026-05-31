import { NextResponse } from "next/server";

const SUPABASE_URL =
  "https://qgfngukaujlmfvhzleir.supabase.co/rest/v1";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnZm5ndWthdWpsbWZ2aHpsZWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzM0MDUsImV4cCI6MjA5NTQ0OTQwNX0.K2MGbU5B2NI35sv0mKGedcawvUKzelB0M_OpuQDd_bw";

const TELEGRAM_BOT_TOKEN =
  "8895972326:AAGdh6EhcZaWSTZsZ9eohtSH8qstL2KLMRc";

const TELEGRAM_CHAT_ID = "692436488";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${SUPABASE_URL}/guests`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          attendance: body.attendance,
          guests: [
  {
    name: "",
    food: "",
    alcohol: [],
  },
],
          food: body.food,
          alcohol: body.alcohol,
          customAlcohol: body.customAlcohol,
          allergy: body.allergy,
          transfer: body.transfer,
          parking: body.parking,
          wishes: body.wishes,
          email: body.email,
          reason: body.reason,
        }),
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseText,
        },
        {
          status: 500,
        }
      );
    }

    const telegramMessage = `
Новая RSVP заявка

Статус: ${body.attendance}

Гости:
${body.guests?.join(", ")}

Еда:
${body.food}

Алкоголь:
${body.alcohol?.join(", ")}

Свой алкоголь:
${body.customAlcohol}

Трансфер:
${body.transfer}

Парковка:
${body.parking}

Пожелания:
${body.wishes}

Email:
${body.email}

Причина:
${body.reason}
`;

    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
        }),
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}