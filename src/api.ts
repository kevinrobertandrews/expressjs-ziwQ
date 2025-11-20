import express from 'express';
import cors from 'cors';

import { format } from 'date-fns'

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));
app.use(express.static('public'))


interface OpenMeteoResponse {
  current: {
    time: string;
    apparent_temperature: string;
  }
  daily: {
    time: string[],
    sunset: string[], // iso
    sunrise: string[] // iso
    apparent_temperature_min: number
    apparent_temperature_max: number
  }
}


app.get('/ottawa', async (req, res) => {

  try {
    // https://open-meteo.com/
    const ENDPOINT = "https://api.open-meteo.com/v1/forecast?latitude=45.4112&longitude=-75.6981&daily=weather_code,apparent_temperature_min,apparent_temperature_max,sunrise,sunset,daylight_duration,sunshine_duration,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,wind_direction_10m_dominant&models=gem_seamless&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_direction_10m&timezone=America%2FNew_York"
    const response = await fetch(ENDPOINT);
    const weather = await response.json() as OpenMeteoResponse;

    const result = {
      day: format(Date.now(), "EEE, MMM dd"),
      sunrise: weather.daily.sunrise[0].split("T")[1],
      sunset: weather.daily.sunset[0].split("T")[1],
      temp: weather.current.apparent_temperature + " °C",
      high: weather.daily.apparent_temperature_max[0],
      low: weather.daily.apparent_temperature_min[0]
    }

    if (response.ok) {
      res.status(200).send({ data: result })
    }
  } catch (err) {
    throw Error("Unexpected error.");
  }
})
