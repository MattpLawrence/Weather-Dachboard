var key = "168391797cc48918fbec2db27de39874";
var searchBarListEL = $("#searchBarList");
var searchBarEL = $("#searchBar");
var searchBtnEL = $("#searchBtn");

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
    });
}
// ***********************************get location data***********************
function getLocation(searchVal) {
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
      getWeather(lat, lon);
    } catch {
      console.log("no city found");
      searchBarEL.text = "";
    }
  });
}
// *****************************search history*********************
var pastSearches = [];

function saveSearchHistory(searchVal) {
  $("#searchHistoryLabel").css("display", "initial");
  if (localStorage["pastSearches"]) {
    pastSearches = JSON.parse(localStorage["pastSearches"]);
  }
  if (pastSearches.indexOf(searchVal) == -1) {
    pastSearches.unshift(searchVal);
    if (pastSearches.length > 5) {
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
      var searchHistoryLI = $(`<li>`).text(val).attr("class", "historyBtn");
      searchBarListEL.append(searchHistoryLI);
    });
  }
}
//show search history on load / toggle label visibility
historyOnLoad();
function historyOnLoad(e) {
  try {
    drawPastSearches();
    console.log("post past searches");
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
  saveSearchHistory(searchVal);
});
//on enter key press while in search bar run get location function
$(searchBarEL).on("keyup", function (e) {
  if (e.which == 13) {
    var searchVal = searchBar.value;
    searchBarListEL.empty();
    console.log(searchVal);
    getLocation(searchVal);
    saveSearchHistory(searchVal);
  }
});
