var key = "168391797cc48918fbec2db27de39874";

getWeather();

function getWeather() {
  var lat = "33.748995";
  var lon = "-84.387982";
  var part = "alerts";
  var unit = "imperial";
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&units=${unit}&appid=${key}`
  )
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

getLocation();

//*****************location APi */
function getLocation() {
  var city = "atlanta";
  fetch(
    `https://spott.p.rapidapi.com/places/autocomplete?limit=10&skip=0&country=US%2CCA&q=${city}&type=CITY`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "spott.p.rapidapi.com",
        "x-rapidapi-key": "4358a3ae45msh1ef514db96f084bp1426f0jsn143dce70b436",
      },
    }
  )
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {
      console.log("city data" + data);
    });
}
