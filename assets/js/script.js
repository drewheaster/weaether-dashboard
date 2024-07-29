const apiKey = '0eab997c0d387258bb37f0062067d7d3';

// Header fields
const submitCityEl = $("form[id='city-input-field']");
const submitCityInput = $("input[class='city-input']");
const calendarDate = document.getElementById('calendar-date');
const weekDay = document.getElementById('day-of-week');

// Current Temp section fields
const locationTitle = $("h2[class='area-title']");
const currentTempEl = $("h3[class='current-weather-temp']");

// 5 day forecast card fields
const cardsCont = document.getElementById('cards-container');

const searchedCities = [];

calendarDate.textContent = dayjs().format(`MMM, M YYYY`);
weekDay.textContent = dayjs().format(`dddd`);

submitCityEl.on("submit", function(event) {
    event.preventDefault();

    searchedCities.unshift(submitCityInput.val());

    console.log(searchedCities)

    // Geocoder call to get lat/long from searched city input
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${submitCityInput.val()}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(getCoords => {

            const lat = getCoords[0].lat;
            const lon = getCoords[0].lon;

            // General/Current weather call
            fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);

                    const current = data.current
                    const currentTemp = parseInt(current.temp)

                    locationTitle.text(submitCityInput.val());
                    currentTempEl.text(`${currentTemp}° F`);

                })

            // 5 day forecast call
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
                .then(response => response.json())
                .then(fdforecast => {
                    console.log("5 day forecast")
                    console.log(fdforecast)

                    const forecastList = fdforecast.list

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