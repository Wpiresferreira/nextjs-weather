// src/app/api/fetchData/route.js
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('searchTerm');
    const apiKey = process.env.API_KEY;
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apiKey}`);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  