import { Handler } from '@netlify/functions';

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
    
    // Здесь можно отправить данные на email, в Google Sheets или сохранить в файл
    console.log('Получены данные формы:', formData);
    
    // Простой ответ об успешном получении
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Ответ успешно получен! Спасибо!',
        data: formData 
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};