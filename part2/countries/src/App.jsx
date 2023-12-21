import { useState } from "react";
import axios from "axios";
import Search from "./components/Search";
import CountriesList from "./components/CountriesList";

const data = await axios
  .get("https://studies.cs.helsinki.fi/restcountries/api/all")
  .then((response) => response.data)
  .catch((error) => console.log(error));

const App = () => {
  const [search, setSearch] = useState("");
  const [countriesToShow, setCountriesToShow] = useState([]);

  const handleSearchChange = (event) => {
    const newSearch = event.target.value;
    setSearch(newSearch);

    if (!newSearch) {
      setCountriesToShow([]);
    } else {
      const newContriesToShow = data.filter((country) =>
        country.name.common.toLowerCase().includes(newSearch.toLowerCase())
      );
      setCountriesToShow(newContriesToShow);
    }
  };

  return (
    <div>
      <Search value={search} onChange={handleSearchChange} />
      <CountriesList countries={countriesToShow} />
    </div>
  );
};

export default App;
