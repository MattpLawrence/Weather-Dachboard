var key = "168391797cc48918fbec2db27de39874";
var searchBarListEL = $("#searchBarList");
var searchBarEL = $("#searchBar");
var searchBtnEL = $("#searchBtn");
var weatherTodayEl = $("#weatherToday");
// var weatherTodayUL = $("#weatherTodayUL");

//****************************Get weather data***************** */
function getWeather(lat, lon, name) {
  var part = "alerts";
  var unit = "imperial";
  var name = "Seattle";
  var lat = "47.6062";
  var lon = "-122.332";
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
      weatherToday(data);
      weatherFiveDay(data);
    });
  // .catch(function (error) {
  //   console.error(error);
  // });
}
// ***********************************get location data***********************
function getLocation(searchVal) {
  $("#spinner").css("display", "flex"); //start spinner
  const settings = {
    async: true,
    crossDomain: true,
    url: `https://spott.p.rapidapi.com/places/autocomplete?limit=5&skip=0&country=US%2CCA&q=${searchVal}&type=CITY`,
    method: "GET",
    headers: {
      "x-rapidapi-host": "spott.p.rapidapi.com",
      "x-rapidapi-key": "4358a3ae45msh1ef514db96f084bp1426f0jsn143dce70b436",
    },
  };

  $.getJSON(settings, function (data) {
    try {
      console.log(data);
      var timeZone = data[0].timezoneId;
      var name = data[0].name;
      var lat = data[0].coordinates.latitude;
      var lon = data[0].coordinates.longitude;
      getWeather(lat, lon, name);
      todayLabel(name);
    } catch {
      console.log("no city found");
      searchBarEL.text = "";
    }
  });
}
// ***************************Get dates********************
// unixDate();
function unixDate(date) {
  var unixFormat = moment.unix(date).format("dddd MMM Do, YYYY");
  console.log(unixFormat);
}
// *****************************show todays forecast in main window***************

//pull info about today's weather
function weatherToday(data) {
  var today = data.daily[0];
  var todayMaxTemp = "Maximum Temperature:  " + data.daily[0].temp.max + " ᵒF";
  var todayMinTemp = "Minimum Temperature:  " + data.daily[0].temp.min + " ᵒF";
  var todayWindSpeed = "Wind Speed:  " + data.daily[0].wind_speed + "MPH";
  var todayHumidity = "Humidity:  " + data.daily[0].humidity + "%";
  var todayUVIndex = "UV Index:  " + data.daily[0].uvi;
  var todayWeatherType = "Today we will have: " + data.daily[0].weather[0].main;
  var todayWeatherIcon = data.daily[0].weather[0].icon;
  var todayDate = data.daily[0].dt;
  //put in array to loop through
  var todayList = [
    todayWeatherType,
    todayMaxTemp,
    todayMinTemp,
    todayWindSpeed,
    todayHumidity,
    todayUVIndex,
  ];
  //retrieve date
  var unixFormat = moment.unix(todayDate).format("dddd MMM Do, YYYY");
  console.log(unixFormat);
  var todayCity = $("<h2>").text(unixFormat).attr("id", "todayCity");
  $("#todayCityDiv").append(todayCity);
  //for each item make a list item
  $.each(todayList, function (i, val) {
    var weatherTodayLI = $("<li>").text(val).attr("class", "weatherTodayLI");
    $("#weatherTodayUL").append(weatherTodayLI);
  });
  //add weather icon
  var todayIconURL = $("<img id = 'icon'>").attr(
    "src",
    "http://openweathermap.org/img/w/" + todayWeatherIcon + ".png"
  );
  $("#todayCityDiv").append(todayIconURL);
  $("#spinner").css("display", "none"); //stop spinner
}
// show the city and date in the today section
function todayLabel(name) {
  var todayCity = $("<h2>")
    .text(name + ":")
    .attr("id", "todayCity");
  $("#todayCityDiv").append(todayCity);
}

// *****************************Show five day weather forecast.

function weatherFiveDay(data) {
  console.log(data);
  var fiveDay = [
    data.daily[1],
    data.daily[2],
    data.daily[3],
    data.daily[4],
    data.daily[5],
  ];
  $.each(fiveDay, function (i, val) {
    console.log(val);
    var dateNumber = i + 1;
    var weatherIcon = val.weather[0].icon;
    var maxTemp = "Max Temp: " + val.temp.max + " ᵒF";
    var minTemp = "Min Temp: " + val.temp.min + " ᵒF";
    var windSpeed = "Wind Speed: " + val.wind_speed + "MPH";
    var humidity = "Humidity: " + val.humidity + "%";
    //put in array to loop through
    var dayList = [maxTemp, minTemp, windSpeed, humidity];
    console.log(dateNumber);
    console.log(weatherIcon);
    console.log(maxTemp);
    console.log(minTemp);
    console.log(windSpeed);
    console.log(humidity);
    var dayBox = $(`#day${dateNumber}`);
    //push weather icon image to 5 day box
    var iconURL = $("<img class = 'iconFive'>").attr(
      "src",
      "http://openweathermap.org/img/w/" + weatherIcon + ".png"
    );
    $(dayBox).append(iconURL);
    // loop through to add list item to each card
    $.each(dayList, function (i, val) {
      var weatherLI = $("<li>").text(val).attr("class", "weatherLI");
      $(dayBox).append(weatherLI);
    });
  });
}

// *****************************search history*********************
var pastSearches = [];

function saveSearchHistory(searchVal) {
  $("#searchHistoryLabel").css("display", "block");
  if (localStorage["pastSearches"]) {
    pastSearches = JSON.parse(localStorage["pastSearches"]);
  }
  if (pastSearches.indexOf(searchVal) == -1) {
    pastSearches.unshift(searchVal);
    if (pastSearches.length > 10) {
      pastSearches.pop();
    }
    localStorage["pastSearches"] = JSON.stringify(pastSearches);
  }
  searchBar.value = ""; //clear search bar
  drawPastSearches();
}

function drawPastSearches() {
  pastSearches = JSON.parse(localStorage["pastSearches"]); //retrieve from local storage

  if (pastSearches.length) {
    $.each(pastSearches, function (i, val) {
      var searchHistoryLI = $(`<li>`)
        .text(val)
        .attr("class", "searchHistoryLI");
      searchBarListEL.append(searchHistoryLI);
    });
  }
}
//show search history on load / toggle label visibility
historyOnLoad();
function historyOnLoad(e) {
  try {
    drawPastSearches();
  } catch {
    $("#searchHistoryLabel").css("display", "none");
    console.log("no past searches");
  }
}

// ******************************event functions*****************

// on search button press take city name and run get location function
$(searchBtnEL).on("click", function (e) {
  var searchVal = searchBar.value;
  searchBarListEL.empty();
  getLocation(searchVal);
  // getWeather();
  saveSearchHistory(searchVal);
});
//on enter key press while in search bar run get location function
$(searchBarEL).on("keyup", function (e) {
  if (e.which == 13) {
    var searchVal = searchBar.value;
    searchBarListEL.empty();
    getLocation(searchVal);
    // getWeather();
    saveSearchHistory(searchVal);
  }
});
//when search history item is clicked, search it again
$(searchBarListEL).on("click", function (e) {
  var textValue = e.target.innerText;
  var searchVal = textValue;
  getLocation(searchVal);
  // getWeather();
});
