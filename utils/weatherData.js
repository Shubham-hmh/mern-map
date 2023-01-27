
const axios = require('axios');
const constansts = require('../config');

const weatherData = async (address, callback) => {
    const url = constansts.openWeatherMap.wurl + encodeURIComponent(address) + '&appid=' + constansts.openWeatherMap.wkey;
   // console.log(url);
    const req = axios.get(url);
    const res = await req;
   // console.log(res);
    callback(undefined, {
        descp: res.data.weather[0].description,
        temp: res.data.main.temp,
        city: res.data.name,
        humidity: res.data.main.humidity,
        lat: res.data.coord.lat,
        lon: res.data.coord.lon
    });
    //console.log(res.data.name);

}

module.exports = weatherData;