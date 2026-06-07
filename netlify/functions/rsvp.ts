import { Handler } from '@netlify/functions';

// НОВЫЕ КЛЮЧИ SUPABASE (твой новый проект)
const supabaseUrl = 'https://jnwbmdixusxnmhvgiukn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impud2JtZGl4dXN4bm1odmdpdWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MzEyOTEsImV4cCI6MjA5NjQwNzI5MX0.dxQrTWo8OsSFUc7gqfggCqWz0WWZUOqkvQe8tzUdoeY';

// ТВОИ НАСТРОЙКИ TELEGRAM (рабочие)
const TELEGRAM_BOT_TOKEN = "8895972326:AAGdh6EhcZaWSTZsZ9eohtSH8qstL2KLMRc";
const TELEGRAM_CHAT_ID = "692436488";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const formData = JSON.parse(event.body || '{}');
    
    // 1. Сохраняем в Supabase
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        created_at: new Date().toISOString(),
        attendance: formData.attendance,
        guests: formData.guests,
        food: formData.food,
        alcohol: formData.alcohol,
        custom_alcohol: formData.customAlcohol,
        allergy: formData.allergy,
        transfer: formData.transfer,
        parking: formData.parking,
        wishes: formData.wishes,
        email: formData.email,
        reason: formData.reason,
        no_name: formData.noName,
        no_email: formData.noEmail,
      }),
    });

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text();
      throw new Error(`Supabase error ${supabaseResponse.status}: ${errorText}`);
    }

    // 2. Отправляем в Telegram
    const telegramMessage = `
🎉 <b>Новый ответ RSVP!</b>

✅ Статус: ${formData.attendance === 'yes' ? 'Приду' : 'Не приду'}

👥 Гости: ${formData.guests?.join(', ') || 'Не указано'}

🍽 Еда: ${formData.food || 'Не указано'}

🍷 Алкоголь: ${formData.alcohol?.join(', ') || 'Не указано'}

📧 Email: ${formData.email || 'Не указан'}

${formData.reason ? `📝 Причина: ${formData.reason}` : ''}
${formData.noName ? `🙋‍♂️ Имя отказавшегося: ${formData.noName}` : ''}
${formData.noEmail ? `📧 Email отказавшегося: ${formData.noEmail}` : ''}
`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML',
      }),
    });

    console.log('Данные сохранены в Supabase, уведомление отправлено');

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Ответ успешно получен! Спасибо! ❤️',
        data: formData 
      }),
    };
  } catch (error) {
    console.error('Ошибка:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};