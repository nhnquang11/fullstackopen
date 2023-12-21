import { useEffect, useState } from "react";
import axios from "axios";

const api_key = import.meta.env.VITE_SOME_KEY;

const Weather = ({ location, lat, lon }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    axios.get(url).then((response) => {
      setData(response.data.current);
    });
  }, []);
  if (data) {
    return (
      <div>
        <h3>Weather in {location}</h3>
        <p>temperature {data.temp} Celcius</p>
        <img
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
          alt=""
        />
        <p>wind {data.wind_speed} m/s</p>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default Weather;
