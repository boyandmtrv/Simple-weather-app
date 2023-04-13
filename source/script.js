import {
    appFile,
} from './app.js'

const main = document.querySelector('.main'),
    inputSection = main.querySelector('.input-field'),
    txt = inputSection.querySelector('.txt'),
    inputField = inputSection.querySelector('input'),
    locationButton = inputSection.querySelector('button'),
    icons = main.querySelector('.weather-section img'),
    arrow = main.querySelector('header i');

let check;

inputField.addEventListener('keyup', e => {
    if (e.key == 'Enter' && inputField.value !== '') {
        appChecking(inputField.value)
    }
});

locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        console.log('Your browser do not support geolocation');
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    check = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${appFile}`;
    fetchData();
}

function onError(error) {
    txt.innerText = error.message;
    txt.classList.add('error');

}

function appChecking(city) {

    check = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${appFile}`;
    fetchData();
}

function fetchData() {
    txt.innerText = 'Gertting weather details...';
    txt.classList.add('pending');

    fetch(check).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    txt.classList.replace('pending', 'error')
    if (info.cod == '404') {
        txt.innerText = `${inputField.value} isn't a valid city name`;
    } else {

        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        if (id == 800) {
            icons.src = 'images/sun.png'
        } else if (id >= 200 && id <= 232) {
            icons.src = 'images/thunderstorm.png'
        } else if (id >= 300 && id <= 321) {
            icons.src = 'images/drizzle.png'
        } else if (id >= 500 && id <= 531) {
            icons.src = 'images/shower.png'
        } else if (id >= 600 && id <= 622) {
            icons.src = 'images/snowy.png'
        } else if (id >= 701 && id <= 781) {
            icons.src = 'images/foggy.png'
        } else if (id >= 801 && id <= 804) {
            icons.src = 'images/cloudy.png'
        }

        main.querySelector('.temperature .number').innerText = Math.floor(temp);
        main.querySelector('.weather').innerText = description;
        main.querySelector('.location span').innerText = `${city}, ${country}`;
        main.querySelector('.temperature .number-2').innerText = Math.floor(feels_like);
        main.querySelector('.humidity span').innerText = `${humidity}%`;

        txt.classList.remove('pending', 'error');
        main.classList.add('active');
    }
}

arrow.addEventListener('click', () => {
    main.classList.remove('active')
})