function getWeatherInfo(code) {
    const weatherMap = {
        0: { description: "Unknown", icon: "❓" },
        1000: { description: "Clear", icon: "☀️" },
        1001: { description: "Cloudy", icon: "☁️" },
        1100: { description: "Mostly Clear", icon: "🌤️" },
        1101: { description: "Partly Cloudy", icon: "⛅" },
        1102: { description: "Mostly Cloudy", icon: "🌥️" },
        2000: { description: "Fog", icon: "🌫️" },
        2100: { description: "Light Fog", icon: "🌫️" },
        3000: { description: "Light Wind", icon: "🌬️" },
        3001: { description: "Wind", icon: "💨" },
        3002: { description: "Strong Wind", icon: "🌪️" },
        4000: { description: "Drizzle", icon: "🌦️" },
        4001: { description: "Rain", icon: "🌧️" },
        4200: { description: "Light Rain", icon: "🌦️" },
        4201: { description: "Heavy Rain", icon: "⛈️" },
        5000: { description: "Snow", icon: "❄️" },
        5001: { description: "Flurries", icon: "🌨️" },
        5100: { description: "Light Snow", icon: "🌨️" },
        5101: { description: "Heavy Snow", icon: "❄️" },
        6000: { description: "Freezing Drizzle", icon: "🌧️" },
        6001: { description: "Freezing Rain", icon: "🌧️" },
        6200: { description: "Light Freezing Rain", icon: "🌧️" },
        6201: { description: "Heavy Freezing Rain", icon: "⛈️" },
        7000: { description: "Ice Pellets", icon: "🧊" },
        7101: { description: "Heavy Ice Pellets", icon: "🧊" },
        7102: { description: "Light Ice Pellets", icon: "🧊" },
        8000: { description: "Thunderstorm", icon: "⛈️" }
    };

    return weatherMap[code] || { description: "Unknown", icon: "❓" };
}

// Save city to search history
function saveToSearchHistory(cityName, lat, lon) {
    const formattedCity = {
        name: cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase(),
        lat: lat,
        lon: lon
    };

    // Remove city if it already exists (to avoid duplicates)
    savedCities = savedCities.filter(city => {
        // Handle both object and string formats for backward compatibility
        const cityName = city.name || city;
        return cityName.toLowerCase() !== formattedCity.name.toLowerCase();
    });

    // Add city to the beginning of the array
    savedCities.unshift(formattedCity);

    // Limit to 10 cities
    if (savedCities.length > 10) {
        savedCities.pop();
    }

    // Save to localStorage
    localStorage.setItem('weatherSearchHistory', JSON.stringify(savedCities));

    // Update display
    renderSearchHistory();
}

// Display search history
function renderSearchHistory() {
    searchHistory.innerHTML = '';

    savedCities.forEach(city => {
        const cityName = city.name || city; // Handle both object and string formats

        const listItem = document.createElement('li');
        listItem.textContent = cityName;
        listItem.addEventListener('click', () => {
            if (city.lat && city.lon) {
                getWeatherData(cityName, city.lat, city.lon);
            } else {
                getGeocodeAndWeather(cityName);
            }

            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });

        searchHistory.appendChild(listItem);
    });

    // Show/hide clear button based on history
    clearHistoryButton.style.display = savedCities.length ? 'block' : 'none';
}

// Clear search history
function clearSearchHistory() {
    savedCities = [];
    localStorage.removeItem('weatherSearchHistory');
    renderSearchHistory();

    // Show empty state
    showEmptyState();
}

// Initialize caches from localStorage
function initializeCaches() {
    loadGeocodeCache();
    loadWeatherCache();
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCaches();
    init();
});// Create weather animation based on weather code
function createWeatherAnimation(weatherCode) {
    // Remove any existing animation
    const existingAnimation = document.querySelector('.weather-animation-container');
    if (existingAnimation) {
        existingAnimation.remove();
    }

    // Create animation container
    const animationContainer = document.createElement('div');
    animationContainer.className = 'weather-animation-container';

    // Add appropriate animation based on weather code
    let animationHTML = '';

    // Clear
    if (weatherCode === 1000) {
        animationHTML = `<div class="sun"></div>`;
    }
    // Cloudy
    else if (weatherCode === 1001 || weatherCode === 1101 || weatherCode === 1102) {
        animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="cloud cloud-3"></div>
        `;
    }
    // Rain
    else if (weatherCode === 4000 || weatherCode === 4001 || weatherCode === 4200 || weatherCode === 4201) {
        animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="rain-container"></div>
        `;

        // Add raindrops dynamically
        setTimeout(() => {
            const rainContainer = document.querySelector('.rain-container');
            if (rainContainer) {
                for (let i = 0; i < 50; i++) {
                    const raindrop = document.createElement('div');
                    raindrop.className = 'raindrop';
                    raindrop.style.left = `${Math.random() * 100}%`;
                    raindrop.style.height = `${Math.random() * 20 + 10}px`;
                    raindrop.style.animationDuration = `${Math.random() * 2 + 1}s`;
                    raindrop.style.animationDelay = `${Math.random() * 2}s`;
                    rainContainer.appendChild(raindrop);
                }
            }
        }, 100);
    }
    // Snow
    else if (weatherCode === 5000 || weatherCode === 5001 || weatherCode === 5100 || weatherCode === 5101) {
        animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
        `;

        // Add snowflakes dynamically
        setTimeout(() => {
            const animationContainer = document.querySelector('.weather-animation-container');
            if (animationContainer) {
                for (let i = 0; i < 30; i++) {
                    const snowflake = document.createElement('div');
                    snowflake.className = 'snowflake';
                    snowflake.style.left = `${Math.random() * 100}%`;
                    snowflake.style.width = `${Math.random() * 8 + 4}px`;
                    snowflake.style.height = snowflake.style.width;
                    snowflake.style.animationDuration = `${Math.random() * 3 + 2}s, ${Math.random() * 2 + 3}s`;
                    snowflake.style.animationDelay = `${Math.random() * 2}s`;
                    animationContainer.appendChild(snowflake);
                }
            }
        }, 100);
    }
    // Fog
    else if (weatherCode === 2000 || weatherCode === 2100) {
        animationHTML = `<div class="fog"></div>`;
    }
    // Thunderstorm
    else if (weatherCode === 8000) {
        animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="lightning"></div>
            <div class="rain-container"></div>
        `;

        // Add raindrops dynamically
        setTimeout(() => {
            const rainContainer = document.querySelector('.rain-container');
            if (rainContainer) {
                for (let i = 0; i < 50; i++) {
                    const raindrop = document.createElement('div');
                    raindrop.className = 'raindrop';
                    raindrop.style.left = `${Math.random() * 100}%`;
                    raindrop.style.height = `${Math.random() * 20 + 10}px`;
                    raindrop.style.animationDuration = `${Math.random() * 2 + 1}s`;
                    raindrop.style.animationDelay = `${Math.random() * 2}s`;
                    rainContainer.appendChild(raindrop);
                }
            }
        }, 100);
    }
    // Wind
    else if (weatherCode === 3000 || weatherCode === 3001 || weatherCode === 3002) {
        // Add wind lines dynamically
        setTimeout(() => {
            const animationContainer = document.querySelector('.weather-animation-container');
            if (animationContainer) {
                for (let i = 0; i < 20; i++) {
                    const windLine = document.createElement('div');
                    windLine.className = 'wind-line';
                    windLine.style.top = `${Math.random() * 100}%`;
                    windLine.style.width = `${Math.random() * 100 + 50}px`;
                    windLine.style.animationDuration = `${Math.random() * 3 + 2}s`;
                    windLine.style.animationDelay = `${Math.random() * 3}s`;
                    animationContainer.appendChild(windLine);
                }
            }
        }, 100);
    }
    // Default - display some clouds
    else {
        animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
        `;
    }

    // Set the animation HTML
    animationContainer.innerHTML = animationHTML;

    // Add the animation container to the main content
    document.querySelector('.main-content').appendChild(animationContainer);
}// DOM elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const currentWeatherContainer = document.getElementById('current-weather-container');
const forecastContainer = document.getElementById('forecast-container');
const weatherDetailsContainer = document.getElementById('weather-details-container');
const locationInfoContainer = document.getElementById('location-info');
const searchHistory = document.getElementById('search-history');
const clearHistoryButton = document.getElementById('clear-history');
const modeToggle = document.getElementById('mode-toggle');
const unitsToggle = document.getElementById('units-toggle');
const mobileToggle = document.getElementById('mobile-toggle');
const sidebar = document.querySelector('.sidebar');
const dateDisplay = document.getElementById('date-display');

const apiKey = '1PYbxJtVwgkVxbOWtIXQlx6hePeJP70U';

// Base URL for API calls
const forecastUrl = 'https://api.tomorrow.io/v4/weather/forecast';

// Saved cities with coordinates
let savedCities = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// Units preference (metric or imperial)
let useImperialUnits = localStorage.getItem('weatherUnits') === 'imperial';

// Weather data cache
const weatherCache = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Geocoding cache
const geocodeCache = {};
const GEOCODE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Initialize the application
function init() {
    // Set up event listeners
    searchButton.addEventListener('click', handleSearch);
    clearHistoryButton.addEventListener('click', clearSearchHistory);
    modeToggle.addEventListener('click', toggleMode);
    unitsToggle.addEventListener('click', toggleUnits);
    mobileToggle.addEventListener('click', toggleSidebar);

    document.querySelector('.dashboard-header').addEventListener('click', function(e) {
        if (e.target.tagName !== 'H2' && window.innerWidth <= 768) {
            toggleSidebar();
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Display current date
    updateDateDisplay();

    // Display search history
    renderSearchHistory();

    // Update units toggle button display
    updateUnitsToggleDisplay();

    // Load weather data for most recent city
    loadInitialWeatherData();

    // Load saved theme preference
    loadThemePreference();

    // Clean up old cache items from localStorage
    cleanupOldCacheItems();
}

// Load initial weather data
function loadInitialWeatherData() {
    if (savedCities.length > 0) {
        // If we have coordinates stored
        if (savedCities[0].lat && savedCities[0].lon) {
            getWeatherData(savedCities[0].name, savedCities[0].lat, savedCities[0].lon);
        } else {
            // For backward compatibility
            getGeocodeAndWeather(savedCities[0].name || savedCities[0]);
        }
    } else {
        // Show empty state
        showEmptyState();
    }
}

// Clean up old cache items from localStorage
function cleanupOldCacheItems() {
    const now = Date.now();

    // Clean up weather cache
    Object.keys(weatherCache).forEach(key => {
        if (now - weatherCache[key].timestamp > CACHE_DURATION) {
            delete weatherCache[key];
        }
    });

    // Clean up geocode cache
    Object.keys(geocodeCache).forEach(key => {
        if (now - geocodeCache[key].timestamp > GEOCODE_CACHE_DURATION) {
            delete geocodeCache[key];
        }
    });
}

// Show empty dashboard state
function showEmptyState() {
    currentWeatherContainer.innerHTML = `
        <div class="placeholder-text">
            Search for a city to see current weather
        </div>
    `;

    forecastContainer.innerHTML = `
        <div class="placeholder-text">
            Search for a city to see forecast
        </div>
    `;

    weatherDetailsContainer.innerHTML = `
        <div class="placeholder-text">
            No weather details available
        </div>
    `;

    locationInfoContainer.innerHTML = `
        <div class="placeholder-text">
            Location information will appear here
        </div>
    `;
}

// Toggle sidebar on mobile
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Toggle light/dark mode
function toggleMode() {
    const body = document.body;

    if (body.classList.contains('light-mode')) {
        // Switch to dark mode
        body.classList.remove('light-mode');
        modeToggle.innerHTML = '<span>☀️</span>'; // Sun emoji for light mode option
        localStorage.setItem('weatherDashboardTheme', 'dark');
    } else {
        // Switch to light mode
        body.classList.add('light-mode');
        modeToggle.innerHTML = '<span>🌙</span>'; // Moon emoji for dark mode option
        localStorage.setItem('weatherDashboardTheme', 'light');
    }
}

// Toggle units between metric and imperial
function toggleUnits() {
    useImperialUnits = !useImperialUnits;

    // Save preference
    localStorage.setItem('weatherUnits', useImperialUnits ? 'imperial' : 'metric');

    // Update UI
    updateUnitsToggleDisplay();

    // Refresh weather data if available
    if (savedCities.length > 0) {
        const city = savedCities[0];
        if (city.lat && city.lon) {
            // Try to use cached data with new units if possible
            getWeatherData(city.name, city.lat, city.lon);
        }
    }
}

// Update the units toggle button display
function updateUnitsToggleDisplay() {
    if (useImperialUnits) {
        unitsToggle.innerHTML = '<span>°F</span>';
        unitsToggle.classList.add('imperial');
        unitsToggle.classList.remove('metric');
    } else {
        unitsToggle.innerHTML = '<span>°C</span>';
        unitsToggle.classList.add('metric');
        unitsToggle.classList.remove('imperial');
    }
}

// Load saved theme preference
function loadThemePreference() {
    const savedTheme = localStorage.getItem('weatherDashboardTheme');

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        modeToggle.innerHTML = '<span>🌙</span>';
    }
}

// Update date display
function updateDateDisplay() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    dateDisplay.textContent = now.toLocaleDateString(undefined, options);
}

// Handle search button click
function handleSearch() {
    const city = cityInput.value.trim();

    if (city) {
        getGeocodeAndWeather(city);
        cityInput.value = '';

        // Close sidebar on mobile after search
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    } else {
        alert('Please enter a city name');
    }
}

// Create a unique ID for each gradient and mask to avoid conflicts
function createUniqueLoaderIds() {
    const timestamp = Date.now();
    return {
        gradId: `grad-${timestamp}`,
        mask1Id: `mask1-${timestamp}`,
        mask2Id: `mask2-${timestamp}`
    };
}

// Show loading state
function showLoadingState() {
    const ids = createUniqueLoaderIds();

    const loaderHTML = `
        <div class="loading">
            <svg class="pl" viewBox="0 0 160 160" width="160px" height="160px" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${ids.gradId}" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#000"></stop>
                        <stop offset="100%" stop-color="#fff"></stop>
                    </linearGradient>
                    <mask id="${ids.mask1Id}">
                        <rect x="0" y="0" width="160" height="160" fill="url(#${ids.gradId})"></rect>
                    </mask>
                    <mask id="${ids.mask2Id}">
                        <rect x="28" y="28" width="104" height="104" fill="url(#${ids.gradId})"></rect>
                    </mask>
                </defs>

                <g>
                    <g class="pl__ring-rotate">
                        <circle class="pl__ring-stroke" cx="80" cy="80" r="72" fill="none" stroke="hsl(223,90%,55%)" stroke-width="16" stroke-dasharray="452.39 452.39" stroke-dashoffset="452" stroke-linecap="round" transform="rotate(-45,80,80)"></circle>
                    </g>
                </g>
                <g mask="url(#${ids.mask1Id})">
                    <g class="pl__ring-rotate">
                        <circle class="pl__ring-stroke" cx="80" cy="80" r="72" fill="none" stroke="hsl(193,90%,55%)" stroke-width="16" stroke-dasharray="452.39 452.39" stroke-dashoffset="452" stroke-linecap="round" transform="rotate(-45,80,80)"></circle>
                    </g>
                </g>

                <g>
                    <g stroke-width="4" stroke-dasharray="12 12" stroke-dashoffset="12" stroke-linecap="round" transform="translate(80,80)">
                        <polyline class="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(-135,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(-90,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(-45,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(0,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(45,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(90,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(135,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(180,0,0) translate(0,40)"></polyline>
                    </g>
                </g>
                <g mask="url(#${ids.mask1Id})">
                    <g stroke-width="4" stroke-dasharray="12 12" stroke-dashoffset="12" stroke-linecap="round" transform="translate(80,80)">
                        <polyline class="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(-135,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(-90,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(-45,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(0,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(45,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(90,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(135,0,0) translate(0,40)"></polyline>
                        <polyline class="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(180,0,0) translate(0,40)"></polyline>
                    </g>
                </g>

                <g>
                    <g transform="translate(64,28)">
                        <g class="pl__arrows" transform="rotate(45,16,52)">
                            <path fill="hsl(3,90%,55%)" d="M17.998,1.506l13.892,43.594c.455,1.426-.56,2.899-1.998,2.899H2.108c-1.437,0-2.452-1.473-1.998-2.899L14.002,1.506c.64-2.008,3.356-2.008,3.996,0Z"></path>
                            <path fill="hsl(223,10%,90%)" d="M14.009,102.499L.109,58.889c-.453-1.421,.559-2.889,1.991-2.889H29.899c1.433,0,2.444,1.468,1.991,2.889l-13.899,43.61c-.638,2.001-3.345,2.001-3.983,0Z"></path>
                        </g>
                    </g>
                </g>
                <g mask="url(#${ids.mask2Id})">
                    <g transform="translate(64,28)">
                        <g class="pl__arrows" transform="rotate(45,16,52)">
                            <path fill="hsl(333,90%,55%)" d="M17.998,1.506l13.892,43.594c.455,1.426-.56,2.899-1.998,2.899H2.108c-1.437,0-2.452-1.473-1.998-2.899L14.002,1.506c.64-2.008,3.356-2.008,3.996,0Z"></path>
                            <path fill="hsl(223,90%,80%)" d="M14.009,102.499L.109,58.889c-.453-1.421,.559-2.889,1.991-2.889H29.899c1.433,0,2.444,1.468,1.991,2.889l-13.899,43.61c-.638,2.001-3.345,2.001-3.983,0Z"></path>
                        </g>
                    </g>
                </g>
            </svg>
            <div class="loading-text">Fetching weather data...</div>
        </div>
    `;

    currentWeatherContainer.innerHTML = loaderHTML;
    forecastContainer.innerHTML = `<div class="placeholder-text">Loading forecast data...</div>`;
    weatherDetailsContainer.innerHTML = `<div class="placeholder-text">Loading weather details...</div>`;
    locationInfoContainer.innerHTML = `<div class="placeholder-text">Loading location information...</div>`;
}

// Show error state
function showErrorState(errorMessage, isRateLimit = false) {
    let errorHTML;

    if (isRateLimit) {
        errorHTML = `
            <div class="placeholder-text">
                <p>API rate limit reached. Please try again in a few moments.</p>
                <p><small>Error: ${errorMessage}</small></p>
            </div>
        `;
    } else {
        errorHTML = `
            <div class="placeholder-text">
                <p>Error: ${errorMessage}</p>
            </div>
        `;
    }

    currentWeatherContainer.innerHTML = errorHTML;
    forecastContainer.innerHTML = errorHTML;
    weatherDetailsContainer.innerHTML = errorHTML;
    locationInfoContainer.innerHTML = errorHTML;
}

// Get geocode from city name (with caching)
async function getGeocodeAndWeather(city) {
    try {
        // Show loading state
        showLoadingState();

        // Check cache first
        const cacheKey = city.toLowerCase();
        const currentTime = Date.now();

        // Use cached geocode data if available and not expired
        if (geocodeCache[cacheKey] &&
            (currentTime - geocodeCache[cacheKey].timestamp) < GEOCODE_CACHE_DURATION) {
            console.log("Using cached geocode data for:", city);

            const { lat, lon, name, country } = geocodeCache[cacheKey].data;
            getWeatherData(name, lat, lon, country);
            return;
        }

        // Use OpenStreetMap Nominatim API for geocoding (it's free and doesn't require API key)
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        if (!geocodeData || geocodeData.length === 0) {
            throw new Error('City not found');
        }

        // Get the first result's coordinates
        const lat = geocodeData[0].lat;
        const lon = geocodeData[0].lon;
        const locationName = geocodeData[0].display_name.split(',')[0];
        const country = geocodeData[0].display_name.split(',').slice(-1)[0].trim();

        // Cache the geocode data
        geocodeCache[cacheKey] = {
            timestamp: currentTime,
            data: {
                lat,
                lon,
                name: locationName,
                country
            }
        };

        // Save geocode cache to localStorage
        saveGeocodeCache();

        // Get weather data using coordinates
        getWeatherData(locationName, lat, lon, country);
    } catch (error) {
        // Handle errors
        showErrorState(error.message);
        console.error('Error geocoding city:', error);
    }
}

// Save geocode cache to localStorage
function saveGeocodeCache() {
    try {
        localStorage.setItem('geocodeCache', JSON.stringify(geocodeCache));
    } catch (e) {
        // localStorage might be full, clear old entries
        console.warn('localStorage may be full, clearing older entries');

        // Clear the oldest half of cached items
        const keys = Object.keys(geocodeCache);
        const sortedKeys = keys.sort((a, b) =>
            geocodeCache[a].timestamp - geocodeCache[b].timestamp
        );

        // Remove oldest half
        const toRemove = Math.floor(sortedKeys.length / 2);
        for (let i = 0; i < toRemove; i++) {
            delete geocodeCache[sortedKeys[i]];
        }

        // Try saving again
        try {
            localStorage.setItem('geocodeCache', JSON.stringify(geocodeCache));
        } catch (e) {
            console.error('Failed to save to localStorage even after clearing:', e);
        }
    }
}

// Load geocode cache from localStorage
function loadGeocodeCache() {
    const saved = localStorage.getItem('geocodeCache');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(geocodeCache, parsed);
        } catch (e) {
            console.error('Failed to parse geocode cache:', e);
        }
    }
}

// Get weather data from the API with retry logic and caching
async function getWeatherData(cityName, lat, lon, country = '', retryCount = 0) {
    try {
        // Determine units parameter
        const units = useImperialUnits ? 'imperial' : 'metric';

        // Generate cache key
        const cacheKey = `${lat},${lon},${units}`;
        const currentTime = Date.now();

        // Check if we have cached data less than 30 minutes old
        if (weatherCache[cacheKey] &&
            (currentTime - weatherCache[cacheKey].timestamp) < CACHE_DURATION) {
            console.log("Using cached weather data for:", cityName);

            // Use cached data
            const cachedData = weatherCache[cacheKey].data;
            displayCurrentWeather(cityName, cachedData);
            displayForecast(cachedData);
            displayWeatherDetails(cachedData);
            displayLocationInfo(cityName, lat, lon, country, cachedData);

            // Save city to search history (if not already there)
            saveToSearchHistory(cityName, lat, lon);

            return;
        }

        // If not cached, make API request
        const weatherUrl = `${forecastUrl}?location=${lat},${lon}&apikey=${apiKey}&units=${units}`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            // Handle rate limiting with retry logic
            if (weatherResponse.status === 429 && retryCount < 3) {
                // Calculate delay with exponential backoff (1s, 2s, 4s)
                const delay = Math.pow(2, retryCount) * 1000;
                console.log(`Rate limited. Retrying in ${delay}ms...`);

                // Show a rate limit message
                showRateLimitMessage(delay, retryCount + 1);

                // Wait for the delay period
                await new Promise(resolve => setTimeout(resolve, delay));

                // Retry with increased counter
                return getWeatherData(cityName, lat, lon, country, retryCount + 1);
            }

            throw new Error(`Weather data not available: ${weatherResponse.status}`);
        }

        const weatherData = await weatherResponse.json();

        // Cache the successful response
        weatherCache[cacheKey] = {
            timestamp: currentTime,
            data: weatherData
        };

        // Save weather cache to localStorage
        saveWeatherCache();

        // Save city to search history (if not already there)
        saveToSearchHistory(cityName, lat, lon);

        // Display weather data
        displayCurrentWeather(cityName, weatherData);
        displayForecast(weatherData);
        displayWeatherDetails(weatherData);
        displayLocationInfo(cityName, lat, lon, country, weatherData);
    } catch (error) {
        // Check if this is a rate limit error
        const isRateLimit = error.message.includes('429');

        // Handle errors
        showErrorState(error.message, isRateLimit);
        console.error('Error fetching weather data:', error);
    }
}

// Show rate limit message with countdown
function showRateLimitMessage(delay, attemptNumber) {
    const countdownDuration = delay / 1000;
    let timeLeft = countdownDuration;

    const updateCountdown = () => {
        currentWeatherContainer.innerHTML = `
            <div class="placeholder-text">
                <p>API rate limit reached. Retrying in ${timeLeft} seconds...</p>
                <p><small>Attempt ${attemptNumber} of 3</small></p>
            </div>
        `;

        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateCountdown, 1000);
        }
    };

    updateCountdown();
}

// Save weather cache to localStorage
function saveWeatherCache() {
    try {
        localStorage.setItem('weatherCache', JSON.stringify(weatherCache));
    } catch (e) {
        // localStorage might be full, clear old entries
        console.warn('localStorage may be full, clearing older entries');

        // Clear the oldest half of cached items
        const keys = Object.keys(weatherCache);
        const sortedKeys = keys.sort((a, b) =>
            weatherCache[a].timestamp - weatherCache[b].timestamp
        );

        // Remove oldest half
        const toRemove = Math.floor(sortedKeys.length / 2);
        for (let i = 0; i < toRemove; i++) {
            delete weatherCache[sortedKeys[i]];
        }

        // Try saving again
        try {
            localStorage.setItem('weatherCache', JSON.stringify(weatherCache));
        } catch (e) {
            console.error('Failed to save to localStorage even after clearing:', e);
        }
    }
}

// Load weather cache from localStorage
function loadWeatherCache() {
    const saved = localStorage.getItem('weatherCache');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(weatherCache, parsed);
        } catch (e) {
            console.error('Failed to parse weather cache:', e);
        }
    }
}

// Display current weather
function displayCurrentWeather(cityName, data) {
    // Extract current conditions
    const current = data.timelines.minutely[0];
    const values = current.values;

    // Extract values
    const temp = Math.round(values.temperature);
    const weatherCode = values.weatherCode;

    // Get weather description and icon based on weather code
    const weatherInfo = getWeatherInfo(weatherCode);

    // Get temperature unit
    const tempUnit = useImperialUnits ? '°F' : '°C';

    currentWeatherContainer.innerHTML = `
        <div class="weather-now">
            <div class="weather-icon">${weatherInfo.icon}</div>
            <div class="temperature">${temp}${tempUnit}</div>
            <div class="weather-description">${weatherInfo.description}</div>
            <div class="location-name">${cityName}</div>
        </div>
    `;

    // Add weather animation
    createWeatherAnimation(weatherCode);
}

// Display weather details
function displayWeatherDetails(data) {
    // Extract current conditions
    const current = data.timelines.minutely[0];
    const values = current.values;

    // Extract values
    const feelsLike = Math.round(values.temperatureApparent);
    const humidity = Math.round(values.humidity);
    const windSpeed = Math.round(values.windSpeed);
    const uvIndex = Math.round(values.uvIndex);

    // Get the appropriate units
    const tempUnit = useImperialUnits ? '°F' : '°C';
    const speedUnit = useImperialUnits ? 'mph' : 'm/s';

    weatherDetailsContainer.innerHTML = `
        <div class="details-grid">
            <div class="detail-item">
                <div class="detail-icon">🌡️</div>
                <div class="detail-value">${feelsLike}${tempUnit}</div>
                <div class="detail-label">Feels Like</div>
            </div>
            <div class="detail-item">
                <div class="detail-icon">💧</div>
                <div class="detail-value">${humidity}%</div>
                <div class="detail-label">Humidity</div>
            </div>
            <div class="detail-item">
                <div class="detail-icon">💨</div>
                <div class="detail-value">${windSpeed} ${speedUnit}</div>
                <div class="detail-label">Wind Speed</div>
            </div>
            <div class="detail-item">
                <div class="detail-icon">☀️</div>
                <div class="detail-value">${uvIndex}</div>
                <div class="detail-label">UV Index</div>
            </div>
        </div>
    `;
}

// Display location info
function displayLocationInfo(cityName, lat, lon, country, data) {
    // Format coordinates
    const latFormatted = parseFloat(lat).toFixed(4);
    const lonFormatted = parseFloat(lon).toFixed(4);

    // Get local time from API data
    const localTime = new Date(data.timelines.minutely[0].time).toLocaleTimeString();

    locationInfoContainer.innerHTML = `
        <div class="location-info">
            <div class="location-city">${cityName}</div>
            <div class="location-country">${country}</div>
            <div class="location-coords">Lat: ${latFormatted} | Lon: ${lonFormatted}</div>
            <div class="location-time">Local Time: ${localTime}</div>
        </div>
    `;
}

// Display 5-day forecast
function displayForecast(data) {
    // Create forecast list container
    forecastContainer.innerHTML = '<div class="forecast-list"></div>';
    const forecastList = document.querySelector('.forecast-list');

    // Get daily forecast data
    const dailyForecasts = data.timelines.daily;

    // Get temperature unit
    const tempUnit = useImperialUnits ? '°F' : '°C';

    // Display 5 days of forecast
    dailyForecasts.slice(0, 5).forEach(day => {
        const date = new Date(day.time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const values = day.values;
        const tempMax = Math.round(values.temperatureMax);
        const tempMin = Math.round(values.temperatureMin);
        const weatherCode = values.weatherCodeMax;

        // Get weather description and icon
        const weatherInfo = getWeatherInfo(weatherCode);

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-date">${date}</div>
            <div class="forecast-icon">${weatherInfo.icon}</div>
            <div class="forecast-temp">${tempMin}° - ${tempMax}°${tempUnit}</div>
            <div class="forecast-desc">${weatherInfo.description}</div>
        `;

        forecastList.appendChild(forecastCard);
    });
}

// Create weather animation based on weather code
function createWeatherAnimation(weatherCode) {
  // Remove any existing animation
  const existingAnimation = document.querySelector('.weather-animation-container');
  if (existingAnimation) {
    existingAnimation.remove();
  }

  // Create animation container
  const animationContainer = document.createElement('div');
  animationContainer.className = 'weather-animation-container';

  // Add appropriate animation based on weather code
  let animationHTML = '';

  // Clear
  if (weatherCode === 1000) {
    animationHTML = `<div class="sun"></div>`;
  }
  // Cloudy
  else if (weatherCode === 1001 || weatherCode === 1101 || weatherCode === 1102) {
    animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="cloud cloud-3"></div>
        `;
  }
  // Rain
  else if (weatherCode === 4000 || weatherCode === 4001 || weatherCode === 4200 || weatherCode === 4201) {
    animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="rain-container"></div>
        `;

    // Add raindrops dynamically
    setTimeout(() => {
      const rainContainer = document.querySelector('.rain-container');
      if (rainContainer) {
        for (let i = 0; i < 50; i++) {
          const raindrop = document.createElement('div');
          raindrop.className = 'raindrop';
          raindrop.style.left = `${Math.random() * 100}%`;
          raindrop.style.height = `${Math.random() * 20 + 10}px`;
          raindrop.style.animationDuration = `${Math.random() * 2 + 1}s`;
          raindrop.style.animationDelay = `${Math.random() * 2}s`;
          rainContainer.appendChild(raindrop);
        }
      }
    }, 100);
  }
  // Snow
  else if (weatherCode === 5000 || weatherCode === 5001 || weatherCode === 5100 || weatherCode === 5101) {
    animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
        `;

    // Add snowflakes dynamically
    setTimeout(() => {
      const animationContainer = document.querySelector('.weather-animation-container');
      if (animationContainer) {
        for (let i = 0; i < 30; i++) {
          const snowflake = document.createElement('div');
          snowflake.className = 'snowflake';
          snowflake.style.left = `${Math.random() * 100}%`;
          snowflake.style.width = `${Math.random() * 8 + 4}px`;
          snowflake.style.height = snowflake.style.width;
          snowflake.style.animationDuration = `${Math.random() * 3 + 2}s, ${Math.random() * 2 + 3}s`;
          snowflake.style.animationDelay = `${Math.random() * 2}s`;
          animationContainer.appendChild(snowflake);
        }
      }
    }, 100);
  }
  // Fog
  else if (weatherCode === 2000 || weatherCode === 2100) {
    animationHTML = `<div class="fog"></div>`;
  }
  // Thunderstorm
  else if (weatherCode === 8000) {
    animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="lightning"></div>
            <div class="rain-container"></div>
        `;

    // Add raindrops dynamically
    setTimeout(() => {
      const rainContainer = document.querySelector('.rain-container');
      if (rainContainer) {
        for (let i = 0; i < 50; i++) {
          const raindrop = document.createElement('div');
          raindrop.className = 'raindrop';
          raindrop.style.left = `${Math.random() * 100}%`;
          raindrop.style.height = `${Math.random() * 20 + 10}px`;
          raindrop.style.animationDuration = `${Math.random() * 2 + 1}s`;
          raindrop.style.animationDelay = `${Math.random() * 2}s`;
          rainContainer.appendChild(raindrop);
        }
      }
    }, 100);
  }
  // Wind
  else if (weatherCode === 3000 || weatherCode === 3001 || weatherCode === 3002) {
    // Add wind lines dynamically
    setTimeout(() => {
      const animationContainer = document.querySelector('.weather-animation-container');
      if (animationContainer) {
        for (let i = 0; i < 20; i++) {
          const windLine = document.createElement('div');
          windLine.className = 'wind-line';
          windLine.style.top = `${Math.random() * 100}%`;
          windLine.style.width = `${Math.random() * 100 + 50}px`;
          windLine.style.animationDuration = `${Math.random() * 3 + 2}s`;
          windLine.style.animationDelay = `${Math.random() * 3}s`;
          animationContainer.appendChild(windLine);
        }
      }
    }, 100);
  }
  // Default - display some clouds
  else {
    animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
        `;
  }

  // Set the animation HTML
  animationContainer.innerHTML = animationHTML;

  // Add the animation container to the main content
  document.querySelector('.main-content').appendChild(animationContainer);
}

// Function to update weather animations when theme changes
function updateAnimationsForTheme() {
    // Get the current weather code
    const weatherIconElement = document.querySelector('.weather-icon');
    if (!weatherIconElement) return;

    // Extract the weather icon emoji
    const weatherIcon = weatherIconElement.textContent;

    // Determine weather code from icon (simplified mapping)
    let weatherCode;

    if (weatherIcon.includes('☀️')) weatherCode = 1000; // Clear
    else if (weatherIcon.includes('☁️') || weatherIcon.includes('🌤️') || weatherIcon.includes('⛅') || weatherIcon.includes('🌥️')) weatherCode = 1001; // Cloudy
    else if (weatherIcon.includes('🌫️')) weatherCode = 2000; // Fog
    else if (weatherIcon.includes('🌬️') || weatherIcon.includes('💨') || weatherIcon.includes('🌪️')) weatherCode = 3001; // Wind
    else if (weatherIcon.includes('🌧️') || weatherIcon.includes('🌦️')) weatherCode = 4001; // Rain
    else if (weatherIcon.includes('⛈️')) weatherCode = 8000; // Thunderstorm
    else if (weatherIcon.includes('❄️') || weatherIcon.includes('🌨️')) weatherCode = 5000; // Snow

    // If we found a weather code, recreate the animation
    if (weatherCode) {
        createWeatherAnimation(weatherCode);
    }
}

// Enhanced toggle light/dark mode function
function toggleMode() {
    const body = document.body;

    if (body.classList.contains('light-mode')) {
        // Switch to dark mode
        body.classList.remove('light-mode');
        modeToggle.innerHTML = '<span>☀️</span>'; // Sun emoji for light mode option
        localStorage.setItem('weatherDashboardTheme', 'dark');
    } else {
        // Switch to light mode
        body.classList.add('light-mode');
        modeToggle.innerHTML = '<span>🌙</span>'; // Moon emoji for dark mode option
        localStorage.setItem('weatherDashboardTheme', 'light');
    }

    // Update animations for the new theme
    updateAnimationsForTheme();
}

// Enhance the createWeatherAnimation function to make animations more visible
function createWeatherAnimation(weatherCode) {
    // Remove any existing animation
    const existingAnimation = document.querySelector('.weather-animation-container');
    if (existingAnimation) {
        existingAnimation.remove();
    }

    // Create animation container
    const animationContainer = document.createElement('div');
    animationContainer.className = 'weather-animation-container';

    // Add appropriate animation based on weather code
    let animationHTML = '';

    // Clear
    if (weatherCode === 1000) {
        animationHTML = `<div class="sun"></div>`;
    }
    // Cloudy
    else if (weatherCode === 1001 || weatherCode === 1101 || weatherCode === 1102) {
        animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="cloud cloud-3"></div>
        `;
    }
    // Rain
    else if (weatherCode === 4000 || weatherCode === 4001 || weatherCode === 4200 || weatherCode === 4201) {
        animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="rain-container"></div>
        `;

        // Add raindrops dynamically
        setTimeout(() => {
            const rainContainer = document.querySelector('.rain-container');
            if (rainContainer) {
                for (let i = 0; i < 50; i++) {
                    const raindrop = document.createElement('div');
                    raindrop.className = 'raindrop';
                    raindrop.style.left = `${Math.random() * 100}%`;
                    raindrop.style.height = `${Math.random() * 20 + 10}px`;
                    raindrop.style.animationDuration = `${Math.random() * 2 + 1}s`;
                    raindrop.style.animationDelay = `${Math.random() * 2}s`;
                    rainContainer.appendChild(raindrop);
                }
            }
        }, 100);
    }
    // Snow
    else if (weatherCode === 5000 || weatherCode === 5001 || weatherCode === 5100 || weatherCode === 5101) {
        animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
        `;

        // Add snowflakes dynamically
        setTimeout(() => {
            const animationContainer = document.querySelector('.weather-animation-container');
            if (animationContainer) {
                for (let i = 0; i < 30; i++) {
                    const snowflake = document.createElement('div');
                    snowflake.className = 'snowflake';
                    snowflake.style.left = `${Math.random() * 100}%`;
                    snowflake.style.width = `${Math.random() * 8 + 4}px`;
                    snowflake.style.height = snowflake.style.width;
                    snowflake.style.animationDuration = `${Math.random() * 3 + 2}s, ${Math.random() * 2 + 3}s`;
                    snowflake.style.animationDelay = `${Math.random() * 2}s`;
                    animationContainer.appendChild(snowflake);
                }
            }
        }, 100);
    }
    // Fog
    else if (weatherCode === 2000 || weatherCode === 2100) {
        animationHTML = `<div class="fog"></div>`;
    }
    // Thunderstorm
    else if (weatherCode === 8000) {
        animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="lightning"></div>
            <div class="rain-container"></div>
        `;

        // Add raindrops dynamically
        setTimeout(() => {
            const rainContainer = document.querySelector('.rain-container');
            if (rainContainer) {
                for (let i = 0; i < 50; i++) {
                    const raindrop = document.createElement('div');
                    raindrop.className = 'raindrop';
                    raindrop.style.left = `${Math.random() * 100}%`;
                    raindrop.style.height = `${Math.random() * 20 + 10}px`;
                    raindrop.style.animationDuration = `${Math.random() * 2 + 1}s`;
                    raindrop.style.animationDelay = `${Math.random() * 2}s`;
                    rainContainer.appendChild(raindrop);
                }
            }
        }, 100);
    }
    // Wind
    else if (weatherCode === 3000 || weatherCode === 3001 || weatherCode === 3002) {
        animationHTML = `<div class="wind-container"></div>`;

        // Add wind lines dynamically
        setTimeout(() => {
            const windContainer = document.querySelector('.wind-container');
            if (windContainer) {
                for (let i = 0; i < 20; i++) {
                    const windLine = document.createElement('div');
                    windLine.className = 'wind-line';
                    windLine.style.top = `${Math.random() * 100}%`;
                    windLine.style.width = `${Math.random() * 100 + 50}px`;
                    windLine.style.animationDuration = `${Math.random() * 3 + 2}s`;
                    windLine.style.animationDelay = `${Math.random() * 3}s`;
                    windContainer.appendChild(windLine);
                }
            }
        }, 100);
    }
    // Default - display some clouds
    else {
        animationHTML = `
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
        `;
    }

    // Set the animation HTML
    animationContainer.innerHTML = animationHTML;

    // Add the animation container to the main content
    document.querySelector('.main-content').appendChild(animationContainer);
}
