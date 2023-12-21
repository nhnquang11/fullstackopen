import { useState } from "react";
import Weather from "./Weather";

const Country = ({ data, detail }) => {
  const [toggle, setToggle] = useState(detail ? 1 : 0);
  const handleOnClick = () => {
    setToggle(1 - toggle);
  };

  return (
    <div>
      {data.name.common}{" "}
      <button onClick={handleOnClick}>{toggle ? "Collapse" : "Show"}</button>
      {toggle === 1 && (
        <div>
          <h2>{data.name.common}</h2>
          {data.capital.map((capital, index) => (
            <p key={index}>capital {capital}</p>
          ))}
          <p>area {data.area}</p>

          <h3>languages:</h3>
          <ul>
            {Object.values(data.languages).map((lang) => (
              <li>{lang}</li>
            ))}
          </ul>
          <img src={data.flags.png} width={200} />
          <Weather
            location={data.capital[0]}
            lat={data.capitalInfo.latlng[0]}
            lon={data.capitalInfo.latlng[1]}
          />
        </div>
      )}
    </div>
  );
};

export default Country;
