"use client";
import { useEffect, useState } from "react";
import { Cloud, CloudLightning, CloudRain, CloudSun, Snowflake, Sun } from "lucide-react";

const icons = {
  Clear: Sun,
  Clouds: CloudSun,
  Rain: CloudRain,
  Drizzle: CloudRain,
  Snow: Snowflake,
  Thunderstorm: CloudLightning,
};

// Hidden entirely if the weather service isn't configured or fails
const WeatherChip = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.temperature !== undefined && setWeather(data))
      .catch(() => {});
  }, []);

  if (!weather) return null;
  const Icon = icons[weather.condition] ?? Cloud;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm">
      <Icon size={16} className="text-slate-500" />
      <span className="font-semibold">{Math.round(weather.temperature)}°C</span>
      <span className="text-slate-500">{weather.city}</span>
    </span>
  );
};

export default WeatherChip;
