import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  try {
    if (!process.env.IPINFO_TOKEN || !process.env.WEATHER_API_KEY) {
      return NextResponse.json({ message: "Weather is not configured" }, { status: 404 });
    }

    // Look up the visitor's IP, not the server's (on Vercel the server is in Dublin)
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
    const isPublicIp = ip && !/^(::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip);

    const locationRes = await fetch(
      `https://ipinfo.io/${isPublicIp ? `${ip}/` : ""}json?token=${process.env.IPINFO_TOKEN}`
    );
    const location = await locationRes.json();

    const city = location.city;

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.WEATHER_API_KEY}`
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
