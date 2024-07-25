const apiKey = '0eab997c0d387258bb37f0062067d7d3'

// Header fields
const submitCityEl = $("form[id='city-input-field']");
const submitCityInput = $("input[class='city-input']")

// Current Temp section fields
const locationTitle = $("h2[class='area-title']")
const currentTempEl = $("h3[class='current-weather-temp']")

const searchedCities = [];

submitCityEl.on("submit", function(event) {
    event.preventDefault();

    searchedCities.push(submitCityInput.val());


    console.log(searchedCities)

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${submitCityInput.val()}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(getCoords => {

            const lat = getCoords[0].lat;
            const lon = getCoords[0].lon;

            fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);

                    const currentTemp = data.current.temp

                    locationTitle.text(submitCityInput.val());
                    currentTempEl.text(`${currentTemp}° F`);

                })
        })

})