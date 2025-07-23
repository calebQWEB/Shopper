import { NextResponse } from "next/server";

export async function GET() {
  try {
    const locationRes = await fetch(
      `https://ipinfo.io/json?token=${process.env.IPINFO_TOKEN}`
    );
    const location = await locationRes.json();

    const city = location.city;

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.WEATHER_API_KEY}`
    );
    const weather = await weatherRes.json();

    return NextResponse.json({
      city,
      temperature: weather.main.temp,
      condition: weather.weather[0].main,
      country: location.country,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      { message: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
