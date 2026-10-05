// GET LOGGED-IN USER

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    window.location.href = "login.html";
} else {
    document.getElementById("welcomeUser").textContent =
        "Hi, " + loggedInUser.name;
}


// LOGOUT

function logout() {

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";
}


// SEARCH WEATHER

async function searchWeather() {

    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city, town or village name.");
        return;
    }

    try {

        // Search for the location
        const response = await fetch(
            "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" + encodeURIComponent(city) +
            "&count=10" +
            "&language=en" +
            "&format=json"
        );

        const result = await response.json();

        if (!result.results || result.results.length === 0) {
            alert("Location not found. Try adding the district or state name.");
            return;
        }

        // Prefer India if an Indian location exists
        let place = result.results.find(
            item => item.country_code === "IN"
        );

        if (!place) {
            place = result.results[0];
        }

        // Get weather using latitude and longitude
        const weatherResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + place.latitude +
            "&longitude=" + place.longitude +
            "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
            "&timezone=auto"
        );

        const weather = await weatherResponse.json();

        // Display location
        document.getElementById("cityName").textContent =
            place.name + ", " + place.country;

        // Display temperature
        document.getElementById("temperature").textContent =
            Math.round(weather.current.temperature_2m) + "°C";

        // Display humidity
        document.getElementById("humidity").textContent =
            weather.current.relative_humidity_2m + "%";

        // Display wind
        document.getElementById("wind").textContent =
            Math.round(weather.current.wind_speed_10m) + " km/h";

        // Display condition
        const condition =
            getWeatherDescription(weather.current.weather_code);

        document.getElementById("condition").textContent = condition;

        // Display icon
        document.getElementById("weatherIcon").textContent =
            getWeatherIcon(weather.current.weather_code);

        // Update weather tip
        updateWeatherTip(condition);

    } catch (error) {

        console.error(error);
        alert("Unable to get weather data. Please try again.");

    }
}

// DISPLAY WEATHER

function displayWeather(location, data) {

    const current = data.current;

    document.getElementById("cityName").textContent =
        `${location.name}, ${location.country}`;

    document.getElementById("temperature").textContent =
        `${Math.round(current.temperature_2m)}°C`;

    document.getElementById("condition").textContent =
        getWeatherDescription(current.weather_code);
        updateWeatherTip(
    getWeatherDescription(current.weather_code)
);

    document.getElementById("humidity").textContent =
        `${current.relative_humidity_2m}%`;

    document.getElementById("wind").textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;

    document.getElementById("pressure").textContent =
        `${Math.round(current.surface_pressure)} hPa`;

    document.getElementById("visibility").textContent =
        `${Math.round(current.visibility / 1000)} km`;

    document.getElementById("weatherIcon").textContent =
        getWeatherIcon(current.weather_code);

    // Update forecast

    updateForecast(data.daily);

}


// WEATHER DESCRIPTION

function getWeatherDescription(code) {

    if (code === 0) return "Clear Sky";

    if ([1, 2, 3].includes(code))
        return "Partly Cloudy";

    if ([45, 48].includes(code))
        return "Foggy";

    if ([51, 53, 55].includes(code))
        return "Drizzle";

    if ([61, 63, 65].includes(code))
        return "Rain";

    if ([71, 73, 75].includes(code))
        return "Snow";

    if ([80, 81, 82].includes(code))
        return "Rain Showers";

    if ([95, 96, 99].includes(code))
        return "Thunderstorm";

    return "Unknown";
}


// WEATHER ICON

function getWeatherIcon(code) {

    if (code === 0) return "☀️";

    if ([1, 2].includes(code))
        return "🌤️";

    if (code === 3)
        return "☁️";

    if ([45, 48].includes(code))
        return "🌫️";

    if ([51, 53, 55].includes(code))
        return "🌦️";

    if ([61, 63, 65, 80, 81, 82].includes(code))
        return "🌧️";

    if ([71, 73, 75].includes(code))
        return "❄️";

    if ([95, 96, 99].includes(code))
        return "⛈️";

    return "🌤️";
}


// UPDATE FORECAST

function updateForecast(daily) {

    const forecastCards =
        document.querySelectorAll(".forecast-card");

    for (let i = 0; i < forecastCards.length; i++) {

        const date =
            new Date(daily.time[i]);

        const day =
            date.toLocaleDateString("en-US", {
                weekday: "short"
            });

        const icon =
            getWeatherIcon(daily.weather_code[i]);

        const maxTemp =
            Math.round(daily.temperature_2m_max[i]);

        const minTemp =
            Math.round(daily.temperature_2m_min[i]);

        forecastCards[i].querySelector("p").textContent =
            day;

        forecastCards[i].querySelector("span").textContent =
            icon;

        forecastCards[i].querySelector("strong").textContent =
            `${maxTemp}° / ${minTemp}°`;
    }
}


// LOAD DEFAULT WEATHER


// FAVORITE CITIES

function addFavorite() {

    const city =
        document.getElementById("cityName").textContent;

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(city)) {

        alert("This city is already in your favorites.");

        return;
    }

    favorites.push(city);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    displayFavorites();

    alert("City added to favorites!");
}


// DISPLAY FAVORITES

function displayFavorites() {

    const favoritesList =
        document.getElementById("favoritesList");

    if (!favoritesList) return;

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {

        favoritesList.innerHTML = `
            <p class="no-favorites">
                No favorite cities yet.
            </p>
        `;

        return;
    }

    favoritesList.innerHTML =
        favorites.map((city, index) => `

            <div class="favorite-card">

                <span>📍 ${city}</span>

                <button onclick="removeFavorite(${index})">
                    Remove
                </button>

            </div>

        `).join("");
}


// REMOVE FAVORITE

function removeFavorite(index) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    favorites.splice(index, 1);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    displayFavorites();
}


// WEATHER TIPS

function updateWeatherTip(condition) {

    const tip =
        document.getElementById("weatherTip");

    if (!tip) return;

    if (
        condition.includes("Rain") ||
        condition.includes("Drizzle")
    ) {

        tip.textContent =
            "Carry an umbrella and check rainfall conditions before travelling.";

    } else if (
        condition.includes("Clear") ||
        condition.includes("Sunny")
    ) {

        tip.textContent =
            "Stay hydrated and avoid prolonged exposure to direct sunlight.";

    } else if (
        condition.includes("Thunderstorm")
    ) {

        tip.textContent =
            "Avoid outdoor activities during thunderstorms and stay indoors.";

    } else if (
        condition.includes("Snow")
    ) {

        tip.textContent =
            "Wear warm clothing and take care while travelling.";

    } else {

        tip.textContent =
            "Check the latest weather conditions before planning outdoor activities.";
    }
}


// SHOW FAVORITES WHEN PAGE LOADS

displayFavorites();