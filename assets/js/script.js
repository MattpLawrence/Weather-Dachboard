var key = "168391797cc48918fbec2db27de39874";
var searchBarListEL = $("#searchBarList");
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

function getLocation() {
  var city = "atlanta";
  const settings = {
    async: true,
    crossDomain: true,
    url: `https://spott.p.rapidapi.com/places/autocomplete?limit=5&skip=0&country=US%2CCA&q=${city}&type=CITY`,
    method: "GET",
    headers: {
      "x-rapidapi-host": "spott.p.rapidapi.com",
      "x-rapidapi-key": "4358a3ae45msh1ef514db96f084bp1426f0jsn143dce70b436",
    },
  };
  $.getJSON(settings, function (data) {
    console.log(data[1].name);
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].name);
    }
    var city = data;
    console.log(city);
  });
}
