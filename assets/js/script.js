var key = "168391797cc48918fbec2db27de39874";
var searchBarListEL = $("#searchBarList");
var sideSearchBarListEL = $("#sideSearchBarList");
var searchBarEL = $("#searchBar");
var sideSearchBarEL = $("#sideSearchBar");
var searchBtnEL = $("#searchBtn");

// ***********************************get location data *******************
function fetchCoords(search) {
  var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${key}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        $("#notFound").empty();
        $("#sideNotFound").empty();
        let notFound = $("<li>")
          .text("Location not found.")
          .attr("class", "notFound");
        $("#notFound").append(notFound);
        let sideNotFound = $("<li>")
          .text("Location not found.")
          .attr("class", "notFound");
        $("#sideNotFound").append(sideNotFound);
        drawPastSearches();
      } else {
        $("#notFound").empty();
        $("#sideNotFound").empty();
        console.log(data[0]);
        var name = data[0].name;
        var lat = data[0].lat;
        var lon = data[0].lon;
        $("#todayCityDiv").empty(); //clear DOM from past searches
        getWeather(lat, lon);
        todayLabel(name);
        saveSearchHistory(search);
        tryCloseNav();
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}
// ***********************************get location data *******************
// function getLocation(searchVal) {
//   $("#spinner").css("display", "flex"); //start spinner
//   const settings = {
//     async: true,
//     crossDomain: true,
//     url: `https://spott.p.rapidapi.com/places/autocomplete?limit=5&skip=0&country=US%2CCA&q=${searchVal}&type=CITY`,
//     method: "GET",
//     headers: {
//       "x-rapidapi-host": "spott.p.rapidapi.com",
//       "x-rapidapi-key": "4358a3ae45msh1ef514db96f084bp1426f0jsn143dce70b436",
//     },
//   };

//   $.getJSON(settings, function (data) {
//     try {
//       console.log(data);
//       var name = data[0].name;
//       var lat = data[0].coordinates.latitude;
//       var lon = data[0].coordinates.longitude;
//       $("#todayCityDiv").empty(); //clear DOM from past searches
//       getWeather(lat, lon);
//       todayLabel(name);
//     } catch {
//       console.log("no city found");
//       searchBarEL.text = "";
//     }
//   });
// }
//****************************Get weather data***************** */
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
      weatherToday(data);
      weatherFiveDay(data);
    })
    .catch(function (error) {
      console.error(error);
    });
}

// *****************************show todays forecast in main window***************

//pull info about today's weather
function weatherToday(data) {
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
  var todayCity = $("<h2>").text(unixFormat).attr("id", "todayCity");
  $("#todayCityDiv").append(todayCity);
  //for each item make a list item
  $("#weatherTodayUL").empty(); //clean up after last append
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

// *****************************Show five day weather forecast.*******************

function weatherFiveDay(data) {
  var fiveDay = [
    data.daily[1],
    data.daily[2],
    data.daily[3],
    data.daily[4],
    data.daily[5],
  ];
  $.each(fiveDay, function (i, val) {
    var date = val.dt;
    var dateNumber = i + 1;
    var weatherIcon = val.weather[0].icon;
    var maxTemp = "Max Temp: " + val.temp.max + " ᵒF";
    var minTemp = "Min Temp: " + val.temp.min + " ᵒF";
    var windSpeed = "Wind Speed: " + val.wind_speed + "MPH";
    var humidity = "Humidity: " + val.humidity + "%";
    //put in array to loop through
    var dayList = [maxTemp, minTemp, windSpeed, humidity];
    //set parent container to be appended
    var dayBox = $(`#day${dateNumber}`);
    $(dayBox).empty(); //empty in case a search was already performed
    //get day date for forecast
    var unixFormat = moment.unix(date).format("dddd");
    var dateDisplay = $("<h3>").text(unixFormat).attr("class", "fiveDate");
    $(dayBox).append(dateDisplay);
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
      console.log("greater than 10");
      pastSearches.pop();
    }
    localStorage["pastSearches"] = JSON.stringify(pastSearches);
  }
  sideSearchBar.value = "";
  searchBar.value = ""; //clear search bar
  drawPastSearches();
}

function drawPastSearches() {
  pastSearches = JSON.parse(localStorage["pastSearches"]); //retrieve from local storage

  if (pastSearches.length) {
    searchBarListEL.empty();
    sideSearchBarListEL.empty();
    $.each(pastSearches, function (i, val) {
      var searchHistoryLI = $(`<li>`)
        .text(val)
        .attr("class", "searchHistoryLI");
      searchBarListEL.append(searchHistoryLI);
    });
    $.each(pastSearches, function (i, val) {
      var searchHistoryLI = $(`<li>`)
        .text(val)
        .attr("class", "searchHistoryLI");

      sideSearchBarListEL.append(searchHistoryLI);
    });
  }
}

//******************************************on load****************************
//on load go to last history results, or default to atlanta
$(document).ready(function () {
  //catch error if no local storage can be parsed
  try {
    pastSearches = JSON.parse(localStorage["pastSearches"]);
    var lastVal = pastSearches[0]; //get last search from local storage
    fetchCoords(lastVal);
  } catch {
    //if no local storage default to atlanta
    var initVal = "Atlanta";
    fetchCoords(initVal);
  }
});

// ************************************************event functions*****************

// on search button press take city name and run get location function
$(searchBtnEL).on("click", function (e) {
  var searchVal = searchBar.value;
  searchBarListEL.empty();
  fetchCoords(searchVal);
});
//on enter key press while in search bar run get location function
$(searchBarEL).on("keyup", function (e) {
  if (e.which == 13) {
    var searchVal = searchBar.value;
    searchBarListEL.empty();
    fetchCoords(searchVal);
    tryCloseNav();
  }
});
//when search history item is clicked, search it again
$(searchBarListEL).on("click", function (e) {
  var textValue = e.target.innerText;
  var searchVal = textValue;
  fetchCoords(searchVal);
  tryCloseNav();
});

// mobile version
$("#sideSearchBtn").on("click", function (e) {
  var searchVal = sideSearchBar.value;
  sideSearchBarListEL.empty();
  fetchCoords(searchVal);
});
//on enter key press while in search bar run get location function
$(sideSearchBarEL).on("keyup", function (e) {
  if (e.which == 13) {
    var searchVal = sideSearchBar.value;
    console.log(sideSearchBar);
    searchBarListEL.empty();
    fetchCoords(searchVal);
  }
});
//when search history item is clicked, search it again
$(sideSearchBarListEL).on("click", function (e) {
  var textValue = e.target.innerText;
  var searchVal = textValue;
  fetchCoords(searchVal);
});

// ************************************sidebar function*****************
/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

function tryCloseNav() {
  try {
    closeNav();
  } catch {
    console.log("nav not open");
    return;
  }
}
