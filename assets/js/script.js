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
