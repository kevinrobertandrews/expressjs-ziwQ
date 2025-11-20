import express from 'express';
import cors from 'cors';

import { getHours } from 'date-fns'

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

interface Time {
  iso: string;
  hour12: string;
  hour24: string
  ms: number
}

interface Temperature {
  value: string;
  unit: string;
  time: string;
}

interface OpenMeteoResponse {
  current: {
    time: string;
    apparent_temperature: string;
  }
  daily: {
    time: string[],
    sunset: string[], // iso
    sunrise: string[] // iso
  }
}


app.get('/ottawa', async (req, res) => {

  const ENDPOINT = "https://api.open-meteo.com/v1/forecast?latitude=45.4112&longitude=-75.6981&daily=sunset,sunrise&current=apparent_temperature&timezone=America%2FNew_York"

  const response = await fetch(ENDPOINT);

  const weather = await response.json() as OpenMeteoResponse;
  console.log({ weather })

  const result = {
    sunrise: {
      iso: weather.daily.sunrise[0],
      hour12: "121212",
      hour24: weather.daily.sunrise[0].split("T")[1],
      ms: getHours(weather.daily.sunrise[0])
    },
    sunset: {
      iso: weather.daily.sunset[0],
      hour12: "121212",
      hour24: weather.daily.sunset[0].split("T")[1],
      ms: getHours(weather.daily.sunset[0])
    },
    temperature: {
      value: weather.current.apparent_temperature,
      unit: "C",
      time: weather.current.time.split("T")[1]
    }
  }

  if (response.ok) {
    res.status(200).send({ status: "success", timestamp: new Date().toISOString(), data: result })
  }
})
