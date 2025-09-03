// Axios
import axios from "axios";

// React Hooks
import { useState, useEffect } from "react";

// Material Components
import Container from "@mui/material/Container";
import AirIcon from "@mui/icons-material/Air";
import WavesIcon from "@mui/icons-material/Waves";

function App() {
  const [search, setSearch] = useState("");
  const [cityName, setCityName] = useState("London"); // The choosen city
  const [weatherData, setWeatherData] = useState({
    temp: null,
    icon: null,
    humidity: null,
    windSpeed: null,
  });
  const [suggestions, setSuggestions] = useState([]); // Sug List

  const API_KEY = "808d0173196cd369583009da7fc970f0";

  useEffect(() => {
    if (!cityName) return;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      )
      .then((response) => {
        const temp = Math.round(response.data.main.temp);
        const icon = response.data.weather[0].icon;
        const humidity = response.data.main.humidity;
        const windSpeed = response.data.wind.speed;
        setWeatherData({ temp, icon, humidity, windSpeed });
      })
      .catch((err) => {
        console.error(err);
        setWeatherData({
          temp: null,
          icon: null,
          humidity: null,
          windSpeed: null,
        });
      });
  }, [cityName]);

  useEffect(() => {
    if (search.length < 1) {
      setSuggestions([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${API_KEY}`
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCities();
  }, [search]);

  // When Choosen A City From The Sug List
  const handleSelectSuggestion = (name) => {
    setCityName(name);
    setSearch("");
    setSuggestions([]);
  };

  return (
    <div className="font-poppins w-full h-screen bg-purple-300 grid place-content-center">
      <Container maxWidth="lg" className="flex justify-center items-center">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-700 p-10 rounded-2xl shadow-xl w-full max-w-md">
          {/* Search */}
          <div className="relative w-full">
            <input
              type="text"
              className="rounded-full w-full p-2 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city..."
            />

            {/* Suggestions list */}
            {suggestions.length > 0 && (
              <ul className="absolute bg-white text-black w-full mt-1 rounded-md shadow-lg max-h-40 overflow-auto z-10">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelectSuggestion(s.name)}
                  >
                    {s.name} {s.state ? `(${s.state})` : ""}, {s.country}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Weather img */}
          <div className="flex justify-center mt-6">
            {weatherData.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                alt="weather icon"
                className="w-36"
              />
            )}
          </div>

          {/* City Name And Temperature */}
          <div className="w-full flex justify-center items-center flex-col mt-4">
            <h3 className="text-white text-7xl">{weatherData.temp}°c</h3>
            <h3 className="text-white font-poppins text-5xl">{cityName}</h3>
          </div>

          {/* Weather description */}
          <div className="w-full flex gap-10 mt-10 justify-center">
            <div className="flex gap-1.5">
              <WavesIcon
                className="text-white mt-2 mr-1"
                sx={{ fontSize: 30 }}
              />
              <div className="text-white">
                {weatherData.humidity}% <br />
                Humidity
              </div>
            </div>
            <div className="flex gap-1.5">
              <AirIcon className="text-white mt-2 mr-1" sx={{ fontSize: 30 }} />
              <div className="text-white">
                {weatherData.windSpeed} km/h <br />
                Wind Speed
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
