"use client";

import { useEffect, useState } from "react";
import nature from "../../../../../public/nature.png";
import Image from "next/image";
import {
  CloudLightning,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
} from "lucide-react";
import SalesChart from "./SalesChart";

const Dashboard = ({ orders }) => {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        console.error("Failed to fetch user data");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      const response = await fetch("/api/weather");
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
      } else {
        alert("Failed to fetch weather data");
      }
    };

    fetchWeather();
  }, []);

  // let totalOrders;
  // let todaysOrders;
  // let todaysRevenue;
  // let totalRevenue;

  // if (orders) {
  //   totalOrders = orders?.orders.reduce((total, order) => {
  //     return total + order.items.length;
  //   }, 0);

  //   todaysOrders = orders?.ordersByDay.reduce((total, order) => {
  //     return total + order.items.length;
  //   }, 0);

  //   totalRevenue = orders?.orders.reduce((total, order) => {
  //     return total + Number(order.totalPrice);
  //   }, 0);

  //   todaysRevenue = orders?.ordersByDay.reduce((total, order) => {
  //     return total + Number(order.totalPrice);
  //   }, 0);
  // }

  return (
    <section className="h-screen">
      {user && (
        <div>
          <h1 className="font-monsterrat text-xl md:text-4xl font-bold md:font-extrabold">
            Hi, {user.name}
          </h1>
          <p className="font-monsterrat text-sm md:text-base font-normal text-gray-500 mt-2">
            Welcome to your dashboard. Here you can manage your products,
            orders, and customers.
          </p>

          <div className="relative w-full grid lg:flex items-center justify-start gap-4 mt-2">
            <div className="h-52 w-52 md:h-72 md:w-96 relative">
              <Image
                src={nature}
                alt="Nature"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            {weather && (
              <div className="absolute flex items-center justify-center flex-wrap gap-3 top-0 left-4 mt-4">
                <div>
                  {weather.condition === "Clear" && <Sun color="#ffffff" />}
                  {weather.condition === "Rain" && (
                    <CloudRain color="#ffffff" />
                  )}
                  {weather.condition === "Clouds" && (
                    <CloudSun color="#ffffff" />
                  )}
                  {weather.condition === "Snow" && (
                    <Snowflake color="#ffffff" />
                  )}
                  {weather.condition === "Thunderstorm" && (
                    <CloudLightning color="#ffffff" />
                  )}
                </div>
                <h2 className="font-monsterrat text-lg md:text-2xl font-bold text-white">
                  {weather.temperature}°C
                </h2>
                <div>
                  <p className="font-monsterrat text-sm font-normal text-gray-300">
                    {weather.city}
                  </p>
                  <p className="font-monsterrat text-sm font-normal text-gray-300">
                    {weather.country}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="w-full md:w-52 lg:w-60 bg-card h-32 rounded-lg grid items-start justify-start gap-4 p-4">
                <h2 className="font-monsterrat text-sm md:text-base font-bold text-white">
                  Today's Orders
                </h2>
                <p className="font-monsterrat text-lg md:text-3xl font-extrabold text-white">
                  {/* {todaysOrders} */} 11
                </p>
              </div>

              <div className="w-full md:w-52 lg:w-60 h-32 bg-card rounded-lg grid items-start justify-start gap-4 p-4">
                <h2 className="font-monsterrat text-sm md:text-base font-bold text-white">
                  Today's Revenue
                </h2>
                <p
                  className="font-monsterrat text-lg md:text-2xl font-normal text-white"
                  onClick={() => {
                    console.log(orders);
                  }}
                >
                  {/* NGN {todaysRevenue.toLocaleString()} */} $12,000
                </p>
              </div>

              <div className="w-full md:w-52 lg:w-60 h-32 bg-card rounded-lg grid items-start justify-start gap-4 p-4">
                <h2 className="font-monsterrat text-sm md:text-base font-bold text-white">
                  Total Orders
                </h2>
                <p className="font-monsterrat text-lg md:text-3xl font-extrabold text-white">
                  {/* {totalOrders} */} 23
                </p>
              </div>

              <div className="w-full md:w-52 lg:w-60 h-32 bg-card rounded-lg grid items-start justify-start gap-4 p-4">
                <h2 className="font-monsterrat text-sm md:text-base font-bold text-white">
                  Total Revenue
                </h2>
                <p className="font-monsterrat text-lg md:text-2xl font-normal text-white">
                  {/* NGN {totalRevenue.toLocaleString()} */} $20,000
                </p>
              </div>
            </div>
          </div>

          <div>
            <SalesChart orders={orders} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
