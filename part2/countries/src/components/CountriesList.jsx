import Country from "./Country";
import { v4 as uuidv4 } from "uuid";

const CountriesList = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Two many matches, specify another filter</p>;
  } else if (countries.length === 1) {
    return (
      <div>
        <Country key={uuidv4()} data={countries[0]} detail={true} />
      </div>
    );
  } else {
    return (
      <div>
        {countries.map((country) => (
          <Country key={country.cca3} data={country} detail={false} />
        ))}
      </div>
    );
  }
};

export default CountriesList;
