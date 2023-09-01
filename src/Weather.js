/* eslint-disable no-unused-vars */
import React, { useEffect, useLayoutEffect, useState } from "react";
// import Clock from "react-live-clock";
// import Forcast from "./forcast";
// import loader from "../images/WeatherIcons.gif";
// import ReactAnimatedWeather from "react-animated-weather";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import SpeedIcon from "@mui/icons-material/Speed";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import GridContent from "./gridContent";
import { apiKey, baseUrl } from "./apiKey";
import Clock from "react-live-clock";

const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

export default function Weather() {
  // temperature, humidity, wind speed, weather conditions(sunny, cloudy, etc.)
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [temperatureC, setTemperatureC] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [humidity, setHumidity] = useState(0);
  const [main, setMain] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [description, setDescription] = useState("Clear");
  const [speed, setSpeed] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      getPosition()
        //If user allow location service then will fetch data & send it to get-weather function.
        .then((position) => {
          // getWeather("India");
          getWeatherByLatLon(
            position.coords.latitude,
            position.coords.longitude
          );
          console.log(position);
        })
        .catch((err) => {
          //If user denied location service then standard location weather will le shown on basis of latitude & latitude.
          // getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const getWeatherByLatLon = async (lat, lon) => {
    const apiCall = await fetch(
      `${baseUrl}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKey}`
    );
    const data = await apiCall.json();
    setWeatherData(data);
    console.log("data: ", data);

    setLat(lat);
    setLon(lon);
    setCity(data?.name);
    setTemperatureC(Math.round(data?.main?.temp));
    setHumidity(data?.main?.humidity);
    setCountry(data?.sys?.country);
    setDescription(data?.weather === [] ? data?.weather[0]?.main : description);
    setSpeed(data?.wind?.speed);
    setPressure(data?.main?.pressure);
  };

  const getWeatherByCity = async (city) => {
    const apiCall = await fetch(
      `${baseUrl}weather?q=${city}&units=metric&APPID=${apiKey}`
    );
    const data = await apiCall.json();
    console.log("data.cod: ",data.cod);
    try {
      if(data.cod === 200) {
        setWeatherData(data);
        console.log("data: ", data);
        
        setLat(lat);
        setLon(lon);
        setCity(data?.name);
        setTemperatureC(Math.round(data?.main?.temp));
        setHumidity(data?.main?.humidity);
        setCountry(data?.sys?.country);
        setDescription(data?.weather !== [] ? data?.weather[0]?.main : description);
        setSpeed(data?.wind?.speed);
        setPressure(data?.main?.pressure);
        
      } else if(data.cod === 404) {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong");
      getPosition();
    }
  };

  return (
    // <Typography>{JSON.stringify(weatherData, null, 2)}</Typography>
    <Box sx={rootContainer}>
      <Box container sx={innerContainer}>

          {/* Form: Text Field to search place, button to hit search and a box to show the searched place*/}
          <Stack
            /* maxHeight={60} */ direction={"row"}
            spacing={3}
            justifyContent={"center"}
          >
            <TextField
              size="small"
              variant="outlined"
              label="Enter city"
              style={{ width: "60%" }}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />

            <Button
              variant="contained"
              onClick={
                query !== ""
                  ? () => {
                      getWeatherByCity(query);
                    }
                  : () => {}
              }
            >
              Submit
            </Button>
          </Stack>

          {/* Weather Details */}
          <Box sx={{marginTop: 6, marginLeft: 12}}>
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <GridContent
                  title="Temperature"
                  subtitle={`${temperatureC}°C`}
                  icon={<DeviceThermostatIcon />}
                />
              </Grid>
              <Grid item xs={6}>
                <GridContent
                  title="Humidity"
                  subtitle={`${humidity}%`}
                  icon={<OpacityIcon />}
                />
              </Grid>
              <Grid item xs={6}>
                <GridContent
                  title="Wind Speed"
                  subtitle={`${speed}m/s`}
                  icon={<SpeedIcon />}
                />
              </Grid>
              <Grid item xs={6}>
                <GridContent title="Weather Condition" subtitle={description} icon={<WbSunnyIcon />} />
              </Grid>
            </Grid>
          </Box>

          {/* Spacing */}
          <Box height={80} />

          {/* City, Country, Date-time & Day */}
          <Box sx={{marginTop: 8, marginLeft: 5}}>
            <Stack direction={"column"} spacing={1}>
              <Typography variant="h4"><Clock format={'HH:mm:ss'} ticking={true}/></Typography>
              <Typography variant="h5">{dateBuilder(new Date())}</Typography>
            </Stack>
          </Box>
        
      </Box>
    </Box>
  );
}

const rootContainer = {
  backgroundColor: "#c7f1ef",
  width: "55vw",
  paddingTop: 7,
  borderTopRightRadius: 30,
  borderBottomRightRadius: 30,
};

const innerContainer = {
  backgroundColor: "#c7f1ef",

};
