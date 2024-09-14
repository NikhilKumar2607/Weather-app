const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variable need
let oldTab = userTab;
const API_KEY = "dbb1d6701af227192b54df67bf65e89d";
oldTab.classList.add("current-tab");
getfromSessionStorage();

//ek kam or hai


function switchTab(newTab)
{
    if(newTab != oldTab)
    {
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))   //agar search form m active nhi hai matlab wahi jana h
        {
            userInfoContainer.classList.remove("active"); //uske liye hume user ko remove karna h or grant access 
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else
        {
            //main pehle search tab p tha ,abb your tab m aa chuka hoon toh weather visible karna h
            //so let check local storage first for coordinates,if we have saved the, there
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click",() => {
    //pass clicker tab as input parameter
        switchTab(userTab);
});

searchTab.addEventListener("click",() => {
    //pass clicker tab as input parameter
        switchTab(searchTab);
});

//check if coordinate sare already present in session storage
function getfromSessionStorage()
{
        const localCoordinates = sessionStorage.getItem("user-coordinates");
        if(!localCoordinates)
        {
                //if local coordinate not present
                grantAccessContainer.classList.add("active");
        }
        else
        {
                const coordinates = JSON.parse(localCoordinates);  //json string ko json object m conver
                fetchUserWeatherInfo(coordinates);
        }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon} = coordinates;
    //make grant access container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    

    //API CALL
        try{
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            const data= await res.json();

            loadingScreen.classList.remove("active");  // data receive
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);   //jo data aaya usko ui pe show

        }
        catch(err){
            loadingScreen.classList.remove("active");
        }
}

function renderWeatherInfo(weatherInfo)
{
    //first we have to fetch element then put data in it come from api
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch value from weather info object and put in ui element

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =  `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}
function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        //show an alert for no geolocation support 
    }
}
function showPosition(position)
{
        const userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        };

        sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            let cityName = searchInput.value;
            if(cityName=="")
            {
                return ;
            }
            else
            {
                fetchSearchWeatherInfo(cityName);
            }
});

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");// old weather remove hogya
    grantAccessContainer.classList.remove("active");

    try
    {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            const data= await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
    }
    catch(err){}
}





