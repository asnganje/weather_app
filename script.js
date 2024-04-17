const enteredCity = document.getElementById('enteredCity');
const citySuggestions = document.getElementById('citySuggestions')
const weatherInfo = document.getElementById('weatherInfo')
const icon = document.getElementById('icon')

const apiKey = "1559e2917afa86f5f2b52b489a539b1f"
const weatherIconElement = document.querySelector('#weatherIcon1');        
weatherIconElement.src = ''


const getCitySuggestions = async (query) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct`;
    const params = {
        q: query,
        limit: 5,
        appid: apiKey
    }
    
    try {
        const response = await axios.get(url, {params})
        const cities = response.data
        const uniqueCityNames = new Set()
        const uniqueCities = []

        cities.forEach((city)=> {
            const cityName = city.name.toLowerCase()
            if (!uniqueCityNames.has(cityName)) {
                uniqueCityNames.add(cityName)
                uniqueCities.push(city)
            }
        })
        return uniqueCities;
    } catch (error) {
        return []
    }
}

const displayCities = (suggestions) => {
    citySuggestions.innerHTML = ''
    suggestions.forEach((city) => {
        const li = document.createElement('li')
        li.textContent = `${city.name}`
        li.classList.add('cursor-pointer')
        li.addEventListener('click', ()=> {
            enteredCity.value = `${city.name}`
            suggestions.innerHTML = '';
            getWeatherInfo(city)
        })
        citySuggestions.appendChild(li)
    });
}

icon.addEventListener('click', async(e)=> {
    e.preventDefault()
    await getWeatherInfo(enteredCity.value)
})

enteredCity.addEventListener('input', async (event)=> {
    const query = event.target.value;
    document.querySelector('#weatherInfo h2').textContent = ''
    document.querySelector('#temperature').textContent = ''
    document.querySelector('#weatherDesc').textContent = ''
    document.querySelector('#detail1').textContent = '';
    document.querySelector('#detail2').textContent = '';
    weatherIconElement.src = ''
    if(query.length >=2) {
        const suggestions = await getCitySuggestions(query)
        displayCities(suggestions)
    } else {
        citySuggestions.innerHTML = ''
    }

})

const getWeatherInfo = async (city) => {
    const cityId = await getCityTarget(city)
    
    const url = `http://api.openweathermap.org/data/2.5/forecast`
    const params = {
        id: cityId,
        appid: apiKey,
        units: 'metric'
    }
    
    try {
        const response = await axios.get(url, {params})
        const data =  response.data

        const iconCode = data.list[0].weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIconElement.src = iconUrl

        document.querySelector('#citySuggestions').innerHTML = ''
        document.querySelector('#weatherInfo h2').textContent = `Weather in ${data.city.name}`
        document.querySelector('#temperature').textContent = `${data.list[0].main.temp}°C`
        document.querySelector('#weatherDesc').textContent = `${data.list[0].weather[0].description}`
        document.querySelector('#detail1').textContent = `Humidity: ${data.list[0].main.humidity}%`;
        document.querySelector('#detail2').textContent = `Wind Speed: ${data.list[0].wind.speed} km/h`;
    } catch (error) {
        throw new Error(error)
    }
}

const getCityTarget = async(city)=> {
    const url1 = `http://api.openweathermap.org/data/2.5/forecast`;
    const query = city.name?city.name:city
    const params = {
        q: query,
        appid: apiKey       
    }
    try {
        const response = await axios.get(url1, {params})
        return response.data.city.id
    } catch (error) {
        console.log("Error abdul");
        console.log(error);
        throw new Error(error)
    }
}