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
      console.log("first call");
      weatherToday(data);
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
      console.log(lat);
      console.log(lon);
      console.log(name);
      console.log(timeZone);
      getWeather(lat, lon, name);
      todayLabel(name);
    } catch {
      console.log("no city found");
      searchBarEL.text = "";
    }
  });
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
  //put in array to loop through
  var todayList = [
    todayWeatherType,
    todayMaxTemp,
    todayMinTemp,
    todayWindSpeed,
    todayHumidity,
    todayUVIndex,
  ];
  //for each item make a list item
  $.each(todayList, function (i, val) {
    console.log(val);
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
// show the city in the today section
function todayLabel(name) {
  console.log(name);
  var todayCity = $("<h2>").text(name).attr("id", "todayCity");
  $("#todayCityDiv").append(todayCity);
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
    console.log(pastSearches);
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
    console.log("post searches");
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
    console.log(searchVal);
    getLocation(searchVal);
    // getWeather();
    saveSearchHistory(searchVal);
  }
});
//when search history item is clicked, search it again
$(searchBarListEL).on("click", function (e) {
  var textValue = e.target.innerText;
  console.log(textValue);
  var searchVal = textValue;
  getLocation(searchVal);
  // getWeather();
});
