const apiKey = '0eab997c0d387258bb37f0062067d7d3';

// Header fields
const submitCityEl = $("form[id='city-input-field']");
const submitCityInput = $("input[class='city-input']");
const calendarDate = document.getElementById('calendar-date');
const weekDay = document.getElementById('day-of-week');
const currentTimeEl = document.getElementById('current-time');
const searchHistoryCont = document.getElementById('search-history-container');

// Current Temp section fields
const locationTitle = $("h2[class='area-title']");
const forecastConditions = $("h3[class='current-weather-conditions']");
const currentTempEl = $("h3[class='current-weather-temp']");
const currentWindSpeedEl = $("h3[id='wind-speed']");
const currentHumidityEl = $("h3[id='humidity']");
const currentRainChanceEl = $("h3[id='rain-chance']");
const currentUVEl = $("h3[id='uv-index']");
const weatherIconContainer = document.getElementById('current-weather-icon-container');

const rainChanceGraphCont = document.getElementById('chance-of-rain-graph');

// 5 day forecast card fields
const cardsCont = document.getElementById('cards-container');

let searchedCities = [];

calendarDate.textContent = dayjs().format(`MMM, M YYYY`);
weekDay.textContent = dayjs().format(`dddd`);

const clock = () => {
    currentTimeEl.textContent = dayjs().format('h:mm a');
}
clock();
setInterval(clock, 1000);

submitCityEl.on("submit", function(event) {
    event.preventDefault();

    while(cardsCont.firstChild) {
        cardsCont.removeChild(cardsCont.firstChild);
    };

    while(weatherIconContainer.firstChild) {
        weatherIconContainer.removeChild(weatherIconContainer.firstChild);
    };

    while(rainChanceGraphCont.firstChild) {
        rainChanceGraphCont.removeChild(rainChanceGraphCont.firstChild);
    };

    const cityEntry = submitCityInput.val().toLowerCase();

    if (!searchedCities.includes(cityEntry)) {
        searchedCities.unshift(cityEntry);
    };

    console.log(searchedCities);

    localStorage.setItem('searchHistory', JSON.stringify(searchedCities));

    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

    while(searchHistoryCont.lastChild) {
        searchHistoryCont.removeChild(searchHistoryCont.lastChild);
    };

    searchHistory.forEach(city => {

        const searchHistoryItemCont = document.createElement('div');
        const searchHistoryItem = document.createElement('div');

        searchHistoryItemCont.setAttribute('class', 'search-history-line');
        searchHistoryItem.setAttribute('class', 'searched-city');
        searchHistoryItem.setAttribute('style', 'cursor: pointer');

        searchHistoryCont.appendChild(searchHistoryItemCont);
        searchHistoryItemCont.appendChild(searchHistoryItem);

        searchHistoryItem.textContent = city[0].toUpperCase() + city.slice(1);
    });


    // Geocoder call to get lat/long from searched city input
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${submitCityInput.val()}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(getCoords => {

            const lat = getCoords[0].lat;
            const lon = getCoords[0].lon;

            // General/Current weather call
            fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
                .then(response => response.json())
                .then(data => {

                    // Current weather data for searched city
                    const current = data.current;
                    const hourly = data.hourly;
                    const currentTempText = parseInt(current.temp);
                    const currentHumidityText = parseInt(current.humidity);
                    const currentWindSpeedText = parseInt(current.wind_speed);
                    const currentUVText = parseInt(current.uvi);
                    const currentRainChanceText = parseInt(data.daily[0].pop * 100);
                    const forecastConditionsText = current.weather[0].description;
                    const currentWeatherIconId = current.weather[0].icon;

                    const currentCity = submitCityInput.val();

                    const currentWeatherIcon = document.createElement('img')

                    currentWeatherIcon.setAttribute('class', 'current-weather-icon');
                    locationTitle.text(currentCity[0].toUpperCase() + submitCityInput.val().slice(1));
                    currentTempEl.text(`${currentTempText}° F`);
                    currentWindSpeedEl.text(`${currentWindSpeedText} mph`);
                    currentHumidityEl.text(`${currentHumidityText}%`);
                    currentRainChanceEl.text(`${currentRainChanceText}%`);
                    currentUVEl.text(`${currentUVText}`);
                    forecastConditions.text(`${forecastConditionsText}`);

                    weatherIconContainer.appendChild(currentWeatherIcon);

                    currentWeatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${currentWeatherIconId}@2x.png`);

                    for (i = 1; i < 5; i++) {
                        const graphInfo = document.createElement('div');
                        const graphTime = document.createElement('h5');
                        const graphLineCont = document.createElement('div');
                        const graphLine = document.createElement('div');
                        const graphPercentage = document.createElement('h5');

                        graphInfo.setAttribute('class' , 'graph-line');
                        graphTime.setAttribute('class', 'graph-time');
                        graphLineCont.setAttribute('class', 'graph-line-container');
                        graphLine.setAttribute('class', 'graph-percentage-line');
                        graphLine.setAttribute('style', `width: 0%`);
                        graphPercentage.setAttribute('class', 'graph-percentage');

                        rainChanceGraphCont.appendChild(graphInfo);
                        graphInfo.appendChild(graphTime);
                        graphInfo.appendChild(graphLineCont);
                        graphInfo.appendChild(graphPercentage);
                        graphLineCont.appendChild(graphLine);

                        graphTime.textContent = dayjs.unix(hourly[i].dt).format(`h:mm a`);
                        graphPercentage.textContent = `${parseInt(hourly[i].pop * 100)}%`;

                        ((i) => {
                            setTimeout(() => {
                                graphLine.setAttribute('style', `width: ${hourly[i].pop * 100}%`);
                            }, 300)
                        })(i)
                    }
                })

            // 5 day forecast call
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
                .then(response => response.json())
                .then(fdforecast => {

                    const forecastList = fdforecast.list;

                    for(let i = 0; i < forecastList.length; i+=8) {

                        const forecastCard = document.createElement('div');
                        const forecastDate = document.createElement('h2');
                        const cardTempDetails = document.createElement('div');
                        const cardTempIconCont = document.createElement('div');
                        const cardWindIconCont = document.createElement('div');
                        const cardHumIconCont = document.createElement('div');
                        const cardTemp = document.createElement('h2');
                        const cardDivider = document.createElement('div');
                        const cardWindInfoDetails = document.createElement('div');
                        const cardHumInfoDetails = document.createElement('div');
                        const cardWindText = document.createElement('h2');
                        const cardHumText = document.createElement('h2');
                        const windSpeedIcon = document.createElement('i');
                        const humidityIcon = document.createElement('i');
                        const tempIcon = document.createElement('img');

                        forecastCard.setAttribute('class', 'forecast-card');
                        forecastDate.setAttribute('class', 'card-calendar-date');
                        cardTempDetails.setAttribute('class', 'card-temp-details');
                        cardTempIconCont.setAttribute('class', 'card-icon-container');
                        cardWindIconCont.setAttribute('class', 'card-icon-container');
                        cardHumIconCont.setAttribute('class', 'card-icon-container');
                        cardTemp.setAttribute('class', 'card-temp');
                        cardDivider.setAttribute('class', 'forecast-card-divider');
                        cardWindInfoDetails.setAttribute('class', 'card-info-details');
                        cardHumInfoDetails.setAttribute('class', 'card-info-details');
                        cardWindText.setAttribute('class', 'card-info');
                        cardHumText.setAttribute('class', 'card-info');
                        windSpeedIcon.setAttribute('class', 'fa-solid fa-wind');
                        windSpeedIcon.setAttribute('id', 'card-wind-speed');
                        humidityIcon.setAttribute('class', 'fa-solid fa-smog');
                        tempIcon.setAttribute('class', 'card-temp-icon');

                        const unixTime = forecastList[i].dt;
                        const cardDate = dayjs.unix(unixTime).format('MM'+'/'+'DD');

                        const futureTemp = parseInt(forecastList[i].main.temp);
                        const futureWind = parseInt(forecastList[i].wind.speed);
                        const futureHumidity = parseInt(forecastList[i].main.humidity);

                        const iconId = forecastList[i].weather[0].icon;

                        tempIcon.setAttribute('src', `https://openweathermap.org/img/wn/${iconId}@2x.png`);

                        cardsCont.appendChild(forecastCard);

                        forecastCard.appendChild(forecastDate);
                        forecastCard.appendChild(cardTempDetails);
                        forecastCard.appendChild(cardDivider);
                        forecastCard.appendChild(cardWindInfoDetails);
                        forecastCard.appendChild(cardHumInfoDetails);

                        forecastDate.textContent = cardDate;

                        cardTempDetails.appendChild(cardTempIconCont);
                        cardTempDetails.appendChild(cardTemp);
                        cardTempIconCont.appendChild(tempIcon);

                        cardWindInfoDetails.appendChild(cardWindIconCont);
                        cardWindInfoDetails.appendChild(cardWindText);
                        cardWindIconCont.appendChild(windSpeedIcon);

                        cardHumInfoDetails.appendChild(cardHumIconCont);
                        cardHumInfoDetails.appendChild(cardHumText);
                        cardHumIconCont.appendChild(humidityIcon);

                        cardTemp.textContent = `${futureTemp}°F`;
                        cardWindText.textContent = `${futureWind}mph`;
                        cardHumText.textContent = `${futureHumidity}%`;
                    }

                })
        })

})