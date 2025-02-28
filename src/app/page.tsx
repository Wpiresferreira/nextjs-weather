"use client";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface Coord {
  lon: number;
  lat: number;
}

interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
}

interface CitySearch {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

interface Temp {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

interface FeelsLike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WeatherDataItem {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: Temp;
  feels_like: FeelsLike;
  pressure: number;
  humidity: number;
  weather: Weather[];
  speed: number;
  deg: number;
  gust: number;
  clouds: number;
  pop: number;
  rain: number;
}

interface WeatherResponse {
  city: City;
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDataItem[];
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

interface Wind {
  speed: number;
  deg: number;
}

interface Clouds {
  all: number;
}

interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

interface WeatherDataCurrent {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<CitySearch | null>(null);
  const [data, setData] = useState<CitySearch[] | null>(null);
  const [dataWeather, setDataWeather] = useState<WeatherResponse | null>(null);
  const [dataWeatherCurrent, setDataWeatherCurrent] =
    useState<WeatherDataCurrent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showList, setShowList] = useState<boolean>(false);

  useEffect(() => {
    const storedCity = localStorage.getItem("city");
    if (storedCity) {
      setSelectedCity(JSON.parse(storedCity));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/fetchData?searchTerm=${searchTerm}`);
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const result: CitySearch[] = await res.json();
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  useEffect(() => {
    if (!selectedCity) return;
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `/api/fetchWeather?lat=${selectedCity.lat}&lon=${selectedCity.lon}`
        );
        const resCurrent = await fetch(
          `/api/fetchWeatherCurrent?lat=${selectedCity.lat}&lon=${selectedCity.lon}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const result: WeatherResponse = await res.json();
        const resultCurrent: WeatherDataCurrent = await resCurrent.json();
        setDataWeather(result);
        setDataWeatherCurrent(resultCurrent);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      setShowList(true);
    } else {
      setShowList(false);
    }
  }
  function handleClickList(city: CitySearch) {
    setShowList(false); 
    setSelectedCity(city);
    localStorage.setItem("city", JSON.stringify(city));
    setSearchTerm("");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-[430px] flex flex-col items-center">
      <h1 className="text-3xl text-sky-900 font-bold p-6">Weather App</h1>
      <Input
        className="p-4 m-4 w-[380px]"
        value={searchTerm}
        onChange={handleChangeInput}
        placeholder="Enter City name and choose on the list"
        // onFocus={(e) => {
        //   setShowList(true);
        // }}
      ></Input>
      <table className={`${showList ? null : "hidden"} self-start ml-6 relative`}>
        <tbody>
          {data && data.length > 0
            ? data.map((d:CitySearch, index: number) => (
                <tr key={index} className="odd:bg-sky-200">
                  <td onClick={() => handleClickList( d )}>
                    {d.name}, {d.state ? d.state + ", " : null} {d.country}
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
      {selectedCity && !showList ? (
        <>
          <div className="border-2 border-sky-900 rounded-lg max-w-[430px] min-w-[390px] flex flex-col items-center">
            <h1 className="text-2xl font-bold">
              {dataWeatherCurrent ? dataWeatherCurrent.name : "Select a city"}
            </h1>
            <div className="flex justify-center items-center">
              {dataWeatherCurrent ? (
                <>
                  <img
                    src={`https://openweathermap.org/img/wn/${dataWeatherCurrent.weather[0].icon}@2x.png`}
                  ></img>
                  <h1 className="text-3xl font-bold">
                    {dataWeatherCurrent
                      ? Math.floor(dataWeatherCurrent.main.temp) + "ºC"
                      : null}
                  </h1>
                </>
              ) : null}
            </div>
            <h2>
              {dataWeatherCurrent
                ? dataWeatherCurrent.weather[0].main +
                  " - " +
                  dataWeatherCurrent.weather[0].description
                : null}
            </h2>
            <div>
              {dataWeatherCurrent
                ? "  Feels like " +
                  Math.floor(dataWeatherCurrent.main.feels_like) +
                  "ºC  "
                : null}
            </div>
          </div>

          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          <h1 className="font-bold mt-6">Forecast next 5 days</h1>
          <table className="table-auto grow border-2 border-sky-800 rounded-md">
            <thead>
              <tr>
                <th className="py-4">Date</th>
                <th className="py-4">Day</th>
                <th className="py-4">Night</th>
                <th className="py-4"></th>
              </tr>
            </thead>
            <tbody>
              {dataWeather &&
                dataWeather.list.map((data, index) => (
                  <tr key={index} className="hover:bg-sky-200 odd:bg-sky-50">
                    <td className="px-4">
                      {new Date(
                        new Date().getTime() + 24 * index * 60 * 60 * 1000
                      ).getDate()}
                      /
                      {new Date(
                        new Date().getTime() + 24 * index * 60 * 60 * 1000
                      ).getMonth() + 1}
                    </td>
                    <td className="px-4">{Math.floor(data.temp.day)}ºC</td>
                    <td className="px-4">{Math.floor(data.temp.eve)}ºC</td>
                    <td className="px-4">
                      <div className="max-h-[50px] overflow-hidden">
                        <img
                          className="w-[50px] h-[50px]"
                          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                        ></img>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
}
