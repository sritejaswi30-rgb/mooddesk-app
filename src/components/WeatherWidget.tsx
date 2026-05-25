/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Compass, Sunrise, Sunset, MapPin, Search } from "lucide-react";
import { WeatherData } from "../types";

interface WeatherWidgetProps {
  widgetOpacity: number;
  glassEffect: boolean;
}

// Preset dynamic simulation cities so users can quickly shift scenes
const PRESET_CITIES: { [key: string]: WeatherData } = {
  tokyo: {
    city: "Tokyo, JP",
    temp: 21,
    condition: "Partly Cloudy",
    humidity: 62,
    rainChance: 15,
    windSpeed: 8,
    sunrise: "04:50 AM",
    sunset: "06:45 PM",
  },
  seattle: {
    city: "Seattle, WA",
    temp: 14,
    condition: "Rainy",
    humidity: 88,
    rainChance: 90,
    windSpeed: 14,
    sunrise: "05:15 AM",
    sunset: "08:50 PM",
  },
  reykjavik: {
    city: "Reykjavik, IS",
    temp: 6,
    condition: "Snowy",
    humidity: 78,
    rainChance: 40,
    windSpeed: 22,
    sunrise: "02:50 AM",
    sunset: "11:55 PM",
  },
  maui: {
    city: "Maui, Hawaii",
    temp: 28,
    condition: "Sunny",
    humidity: 50,
    rainChance: 5,
    windSpeed: 12,
    sunrise: "05:45 AM",
    sunset: "07:05 PM",
  },
  paris: {
    city: "Paris, FR",
    temp: 18,
    condition: "Cozy Fog",
    humidity: 75,
    rainChance: 25,
    windSpeed: 6,
    sunrise: "05:55 AM",
    sunset: "09:30 PM",
  },
};

export default function WeatherWidget({ widgetOpacity, glassEffect }: WeatherWidgetProps) {
  const [selectedCityKey, setSelectedCityKey] = useState<string>("tokyo");
  const [weather, setWeather] = useState<WeatherData>(PRESET_CITIES.tokyo);
  const [customCity, setCustomCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Change simulated weather values slightly over time to feel "live"
  useEffect(() => {
    const defaultData = PRESET_CITIES[selectedCityKey];
    if (defaultData) {
      setWeather(defaultData);
    }
  }, [selectedCityKey]);

  // Live slight variation generator to feel hyper-active & interactive!
  useEffect(() => {
    const timer = setInterval(() => {
      setWeather((prev) => {
        const deltaTemp = (Math.random() - 0.5) * 0.4; // +/- 0.2 degrees
        const deltaHum = Math.round((Math.random() - 0.5) * 2);
        return {
          ...prev,
          temp: parseFloat((prev.temp + deltaTemp).toFixed(1)),
          humidity: Math.min(100, Math.max(0, prev.humidity + deltaHum)),
        };
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleGPSDetect = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock fetch resolving based on actual GPS
          setTimeout(() => {
            const gpsData: WeatherData = {
              city: "Your Location (GPS)",
              temp: Math.round(15 + Math.random() * 12),
              condition: ["Sunny", "Partly Cloudy", "Rainy", "Cozy Fog"][Math.floor(Math.random() * 4)],
              humidity: Math.round(55 + Math.random() * 30),
              rainChance: Math.round(Math.random() * 60),
              windSpeed: Math.round(5 + Math.random() * 15),
              sunrise: "06:10 AM",
              sunset: "08:15 PM",
            };
            setWeather(gpsData);
            setIsLoading(false);
          }, 1200);
        },
        () => {
          alert("Could not access location coordinates. Reverting to presets.");
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCity.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      // Simulate beautifully
      const matchingPresetKey = Object.keys(PRESET_CITIES).find((k) =>
        PRESET_CITIES[k].city.toLowerCase().includes(customCity.toLowerCase())
      );

      if (matchingPresetKey) {
        setWeather(PRESET_CITIES[matchingPresetKey]);
      } else {
        const generatedWeather: WeatherData = {
          city: customCity.charAt(0).toUpperCase() + customCity.slice(1) + ", World",
          temp: Math.round(10 + Math.random() * 20),
          condition: ["Sunny", "Partly Cloudy", "Rainy", "Cozy Fog"][Math.floor(Math.random() * 4)],
          humidity: Math.round(40 + Math.random() * 50),
          rainChance: Math.round(Math.random() * 80),
          windSpeed: Math.round(4 + Math.random() * 18),
          sunrise: "05:30 AM",
          sunset: "08:40 PM",
        };
        setWeather(generatedWeather);
      }
      setCustomCity("");
      setIsLoading(false);
    }, 600);
  };

  const renderWeatherIcon = (condition: string) => {
    const iconClass = "w-10 h-10 animate-bounce";
    switch (condition) {
      case "Sunny":
        return <Sun className={`${iconClass} text-amber-400`} />;
      case "Rainy":
        return <CloudRain className={`${iconClass} text-blue-400`} />;
      case "Snowy":
        return <CloudSnow className={`${iconClass} text-teal-200`} />;
      case "Cozy Fog":
        return <Wind className={`${iconClass} text-slate-400`} />;
      case "Partly Cloudy":
      default:
        return <Cloud className={`${iconClass} text-slate-300 dark:text-slate-400`} />;
    }
  };

  return (
    <div
      id="weather-widget-container"
      className={`${
        glassEffect
          ? "glass-frosted"
          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"
      } p-5 shadow-xl shadow-black/5 text-slate-800 dark:text-white transition-all duration-300 flex flex-col h-full overflow-hidden`}
      style={{ opacity: widgetOpacity / 100 }}
    >
      {/* Header and Selectors */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-rose-500" />
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-950 dark:text-stone-50">Weather Room</h4>
        </div>

        <div className="flex items-center gap-1">
          <select
            value={selectedCityKey}
            onChange={(e) => setSelectedCityKey(e.target.value)}
            className="text-[10px] bg-black/5 dark:bg-white/10 text-slate-800 dark:text-slate-200 border-none rounded-lg px-2 py-1 focus:ring-0 cursor-pointer font-bold"
          >
            <option value="tokyo" className="text-slate-800 bg-white dark:bg-slate-900 dark:text-white">Tokyo 🇯🇵</option>
            <option value="seattle" className="text-slate-800 bg-white dark:bg-slate-900 dark:text-white">Seattle 🇺🇸</option>
            <option value="reykjavik" className="text-slate-800 bg-white dark:bg-slate-900 dark:text-white">Reykjavík 🇮🇸</option>
            <option value="paris" className="text-slate-800 bg-white dark:bg-slate-900 dark:text-white">Paris 🇫🇷</option>
            <option value="maui" className="text-slate-800 bg-white dark:bg-slate-900 dark:text-white">Maui 🏝️</option>
          </select>

          <button
            onClick={handleGPSDetect}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 transition-colors"
            title="Use GPS Geolocation"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Temp & Condition */}
      <div className="flex items-center justify-between my-2 bg-gradient-to-br from-rose-500/5 to-amber-500/5 rounded-2xl p-3 border border-slate-500/5 dark:border-white/5 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center rounded-2xl z-20">
            <span className="text-[10px] font-bold tracking-widest uppercase animate-pulse">
              Locating...
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {renderWeatherIcon(weather.condition)}
          <div>
            <h3 className="font-bold text-2xl tracking-tight leading-tight font-mono text-rose-500 dark:text-rose-400">
              {weather.temp}°C
            </h3>
            <p className="text-[11px] font-bold text-slate-700 dark:text-stone-100 leading-tight">
              {weather.condition}
            </p>
          </div>
        </div>

        <div className="text-right">
          <h4 className="text-xs font-extrabold font-sans truncate max-w-[120px] text-slate-800 dark:text-stone-100" title={weather.city}>
            {weather.city}
          </h4>
          <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1 py-0.5 rounded leading-none">
            LIVE DUST
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleCustomSearch} className="flex gap-1.5 mb-3">
        <input
          type="text"
          value={customCity}
          onChange={(e) => setCustomCity(e.target.value)}
          placeholder="Search global city weather..."
          className="flex-1 text-[10px] bg-slate-500/5 dark:bg-white/5 border border-slate-500/10 dark:border-white/10 rounded-lg py-1 px-2.5 focus:outline-none focus:border-rose-400 text-slate-800 dark:text-white"
        />
        <button
          type="submit"
          className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-400 hover:text-white dark:hover:bg-rose-500 transition-all"
        >
          <Search className="w-3 h-3" />
        </button>
      </form>

      {/* Grid Values details: Humidity, Rain, Sunset/Sunrise */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-slate-500/5">
          <Droplets className="w-3.5 h-3.5 text-blue-500" />
          <div>
            <p className="text-[9px] font-black text-slate-900 dark:text-amber-200 uppercase leading-none">Humidity</p>
            <p className="text-[10px] font-black font-mono py-0.5 text-slate-950 dark:text-white">{weather.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-slate-500/5">
          <CloudRain className="w-3.5 h-3.5 text-sky-500" />
          <div>
            <p className="text-[9px] font-black text-slate-900 dark:text-amber-200 uppercase leading-none">Rain %</p>
            <p className="text-[10px] font-black font-mono py-0.5 text-slate-950 dark:text-white">{weather.rainChance}%</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-slate-500/5">
          <Sunrise className="w-3.5 h-3.5 text-amber-600" />
          <div>
            <p className="text-[9px] font-black text-slate-900 dark:text-amber-200 uppercase leading-none">Sunrise</p>
            <p className="text-[10px] font-black font-mono py-0.5 text-slate-950 dark:text-white">{weather.sunrise}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-slate-500/5">
          <Sunset className="w-3.5 h-3.5 text-rose-500" />
          <div>
            <p className="text-[9px] font-black text-slate-900 dark:text-amber-200 uppercase leading-none">Sunset</p>
            <p className="text-[10px] font-black font-mono py-0.5 text-slate-950 dark:text-white">{weather.sunset}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
