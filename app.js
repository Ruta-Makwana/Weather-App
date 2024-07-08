"strict";

const apiKey = "ëëzéÍ¸w·ß{óm_ñï|Óm";
//built in function to encrypt our apikey
/*  const x = window.atob(apiKey);
 console.log(x); */

const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
let cities = {};

const form = document.querySelector("form");
//render the city
function renderCitycard(city) {
  console.log(city);
  const { name, description, id, icon, temp, state, country, time } = city;
  //convert to milliseconds
  const date = new Date(time * 1000);
  //our time now
  const now = new Date();
  const difference = Math.round((now - date) / 1000 / 60);
  const html = `   <div class="col" data-id=${id}>
              <div class="city">
                <h2 class="city_name">
                  <span>${name}</span><span class="country_code">${
    state ? state : country
  }</span>
                  <i class="bi bi-x-circle-fill close-icon text-danger"></i>
                </h2>
                <div class="city_temp">${temp}<sup>°F</sup></div>
                <figure>
                  <img
                    src="https://openweathermap.org/img/wn/${icon}@2x.png"
                    alt="icon"
                    class="city-icon"
                  />
                </figure>
                <figcaption>${description}</figcaption>
                <div class="card-footer">
                  <small class="text-body-secondary"
                    >last updated ${difference} min ago</small
                  >
                </div>
              </div>
            </div>`;

  //rendering the cards inside the cities container using insert adjacenthtml instead of appendchild
  //because append is appending nodes for existing parent ,also adjacenthtml can relatively place
  //elements according to the elements around
  //beforeend means before the ending of this parent
  document.querySelector(".cities").insertAdjacentHTML("beforeend", html);
  //u an use append
}
//render error
function renderErrors(message) {
  document.querySelector(".error_message").textContent = message;
}

//function that fetches with cityname
async function fetchWithcityName(city) {
  const url = baseUrl + `q=${city}&appid=${btoa(apiKey)}&units=imperial`;

  const res = await axios.get(url);
  console.log(res);
  //details about london
  const cityDetails = res.data;
  //creating an object with only the data needed
  console.log(cityDetails);
  const data = {
    description: cityDetails.weather[0].description,
    icon: cityDetails.weather[0].icon,
    temp: cityDetails.main.temp,
    country: cityDetails.sys.country,
    name: cityDetails.name,
    time: cityDetails.dt,
    id: cityDetails.id,
  };
  return data;
}
//parent function that handles the search
async function handleCitySearch(city) {
  try {
    //fetching the url with city name
    const cityData = await fetchWithcityName(city);
    //if the city is inside the cities object
    if (cities[cityData.id])
      throw new Error(`${city} is already in your card list`);

    //create a new entry in my cities objects
    cities[cityData.id] = cityData;
    //another case:
    //if the user types portland,or,us          0        1    2
    const cityParamas = city.split(","); //["portland","or","us"]  more than 2
    if (cityParamas.length > 2) {
      cities[id].state = cityParamas[1]; //1233{ name:"portland", state:"or"}
    }
    //setting the city inside the local storage
    localStorage.setItem("cities", JSON.stringify(cities));
    renderCitycard(cities[cityData.id]);
  } catch (error) {
    console.log(error);
    renderErrors(error.message);
  }
}
async function fetchWithid(cityid) {
  const url = baseUrl + `id=${cityid}&appid=${btoa(apiKey)}&units=imperial`;

  const res = await axios.get(url);
  console.log(res);
  //details about london
  const cityDetails = res.data;
  //creating an object with only the data needed
  console.log(cityDetails);
  const data = {
    description: cityDetails.weather[0].description,
    icon: cityDetails.weather[0].icon,
    temp: cityDetails.main.temp,
    country: cityDetails.sys.country,
    name: cityDetails.name,
    time: cityDetails.dt,
    id: cityDetails.id,
  };
  return data;
}
async function initializeApp() {
  cities = JSON.parse(localStorage.getItem("cities")) || {};
  //when there are cities inside the cities object in the localstorage , loop over the keys
  //where are the ids and take them and handle them to the fetchwithid function to fetch the cities
  //and then render those data
  Object.keys(cities).map(async (item) => {
    const citydata = await fetchWithid(item);
    //if tthe city has a state , then the state of this city will be equal to the state of it
    if (cities[item].state) citydata.state = cities[item].state;
    renderCitycard(citydata);
  });
}
//when the domcontent is loaded , this function will be triggered
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

//form add event listener
form.addEventListener("submit", (e) => {
  e.preventDefault();
  //selectin value
  const city = form.querySelector(".header_input").value;
  console.log(city);
  renderErrors("");
  form.reset();
  handleCitySearch(city);
});

//delete event listener
document.querySelector(".cities").addEventListener("click", (e) => {
  if (e.target.classList.contains("close-icon")) {
    const card = e.target.closest(".col");
    const CityId = card.dataset.id;
    console.log(CityId);
    //deleting it from the cities object
    delete cities[CityId];
    //removing it from the dom and localstorage
    card.remove();
    localStorage.setItem("cities", JSON.stringify(cities));
  }
});

//setinterval
//we use this function to render the cards inside the cities container each couple of seconds to update the time
setInterval(() => {
  //clear the cities container
  document.querySelector(".cities").innerHTML = "";
  //loop over the values of the cities object which has the cities data and render them again
  Object.values(cities).map((item) => {
    renderCitycard(item);
  });
}, 10000);

//there are 3 ways to loop
//Object.values
//Object.keys
//Object.entries
