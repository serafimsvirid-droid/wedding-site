import { Handler } from '@netlify/functions';

// ТВОИ НОВЫЕ КЛЮЧИ
const supabaseUrl = 'https://jnwbmdixusxnmhvgiukn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impud2JtZGl4dXN4bm1odmdpdWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MzEyOTEsImV4cCI6MjA5NjQwNzI5MX0.dxQrTWo8OsSFUc7gqfggCqWz0WWZUOqkvQe8tzUdoeY';

export const handler: Handler = async (event) => {
  // Разрешаем только POST запросы
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const formData = JSON.parse(event.body || '{}');
    
    // Отправляем данные в Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/rsvp`, {
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

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    console.log('Данные сохранены в Supabase:', formData);
    
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