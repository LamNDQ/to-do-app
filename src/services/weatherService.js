import axios from "axios";

// Free API key for demo - replace with your own from openweathermap.org
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchWeather = async (city) => {
    const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
            q: city,
            appid: API_KEY,
            units: "metric", // Celsius
            lang: "vi",
        },
    });
    return response.data;
};