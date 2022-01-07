var key = "168391797cc48918fbec2db27de39874";
var searchBarListEL = $("#searchBarList");
var searchBarEL = $("#searchBar");
var searchBtnEL = $("#searchBtn");
function getWeather(lat, lon) {
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

// getLocation(city);

function getLocation(city) {
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
    console.log(data);
    var timeZone = data[0].timezoneId;
    var name = data[0].name;
    var lat = data[0].coordinates.latitude;
    var lon = data[0].coordinates.longitude;
    console.log(lat);
    console.log(lon);
    console.log(name);
    console.log(timeZone);
    getWeather(lat, lon);
  });
}

// on search button press take city name and run get location function
$(searchBtnEL).on("click", function (e) {
  var city = searchBar.value;
  searchBar.value = textValue;
  getLocation(city);
});
//on enter key press while in search bar run get location function
$(searchBarEL).on("keyup", function (e) {
  if (e.which == 13) {
    var city = searchBar.value;
    console.log(city);
    getLocation(city);
  }
});
