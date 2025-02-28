// src/app/api/fetchWeather/route.js
import { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req, res) {
  // Check if req.url is defined and if so, construct the URL object
  const url = req.url ? new URL(req.url, `http://${req.headers.host}`) : null;
  const searchParams = url ? url.searchParams : new URLSearchParams();

  // Get lat and lon from searchParams if available
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const apiKey = process.env.API_KEY;

  if (!lat || !lon) {
    res.status(400).json({ error: "Latitude and longitude are required" });
    return;
  }

  try {
    console.log(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&appid=${apiKey}`);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&units=metric&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error("Error fetching weather data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch weather data" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}




// // src/app/api/fetchData/route.js
// export async function GET(req) {
//     const { searchParams } = new URL(req.url);
//     const lat = searchParams.get('lat');
//     const lon = searchParams.get('lon');
//     const apiKey = process.env.API_KEY;
//     const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&&appid=${apiKey}`);
//     // const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apiKey}`);
//     const data = await response.json();
//     return new Response(JSON.stringify(data), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//   }
  