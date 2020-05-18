/* eslint-disable prettier/prettier */
/* eslint-disable indent */
// Get references to page elements


// *** Selectors to onClick event handlers at bottom of this file: index.js
var $petFoundList = $("#petFound-list");
var $loadPetTypesBtn = $("#loadPetTypes"); // button to load type object from petfinder
var $searchPetsBtn = $("#searchPets");
var $signUpSubmitBtn = $("#signUpSubmitBtn");
var $logInSubmitBtn = $("#logInSubmitBtn");
var $searchSubmitBtn = $("#searchSubmitBtn");
var $logOutBtn = $("#logOutBtn");
var $homePageBtn = $("#homePageBtn");
var $searchPageBtn = $("#searchPageBtn");
var $deleteChosenPetBtn = $(".deleteChosenPetBtn");
var $carouselContainer = $("#carousel-container");

var customerId = 0;
var userName = "guest"

var petTypesObject; //global object with petfinder type object array
var petsFoundObject; // global object with petfinder petsFound object array



// ** ADDED BY SB
// displayPetsFound gets displays pets found in PetFinder and repopulates the list
// uses global petsFoundObject to populate table
// assumes API.loadPetTypes() has run and process.env.PETFINDER_ACCESS_TOKEN is valid
var displayPetsFound = function () {
  var petsArray = petsFoundObject.petsFound;
  console.log("petsArray", petsArray);
  var $pets = petsArray.map(function (val) {

    var $a = $("<a target='_blank'>")
      .text(val.name)
      .attr("href", val.url);

    var $li = $("<li>")
      .attr({
        class: "list-group-item",
        "data-id": val.id
      })
      .append($a);

    var $button = $("<button>")
      .addClass("btn btn-danger float-right delete")
      .text("Choose");

    $li.append($button);
    return $li;
  });
  $petFoundList.empty();
  $petFoundList.append($pets);
}


// ADDED BY BD
var searchTaken = false;

function addCards() {
  var dummyArray = petsFoundObject.petsFound;   // petsFoundObject is a global set in apiRoutes.js /searchPets route
  if (!searchTaken) {
    $("#carousel-container").hide();
  } else {
    addIndicators();
    $('#header-container').empty();
    $("#carousel-container").show();
    $(".carousel-inner").empty();
    $("a.caro-controls").css("display", "flex");

    for (var i = 0; i < dummyArray.length; i++) {
      // console.log(dummyArray[i]);
      // if the survey has been taken and there are results, add images to cards in the carousel
      var newDiv = $("<div class='caro-img'>");
      if (i === 0) {
        // first item in the carousel is 'active'
        newDiv.attr({ "class": "carousel-item active card", "data-id": dummyArray[i].id });  // added data-id for onClick choose
      } else {
        newDiv.attr({ "class": "carousel-item card", "data-id": dummyArray[i].id });   // added data-id for onClick choose
      }


      if (dummyArray[i].photos.length === 0) {
        dummyArray[i].photos.push({
          full: "https://t7-live-ahsd8.nyc3.cdn.digitaloceanspaces.com/animalhumanesociety.org/files/styles/animal_450x330/flypub/default_images/shy_10.jpg?itok=xmk-2ZMz"
        });
      }
      var allPetImages = [];
      for (var e = 0; e < dummyArray[i].photos.length; e++) {
        allPetImages.push(dummyArray[i].photos[e].full);
      }
      if (allPetImages.length > 1) {
        console.log(allPetImages);
      }
      allPetImages = allPetImages.toString();


      var image = $("<img>");
      image
        .attr("src", dummyArray[i].photos[0].full)
        .attr("class", "searchResultImg card-img-top");
      newDiv.append(image);
      var cardBody = $("<div>").attr("class", "card-body");
      var cardButton = $("<img src='./images/unfavorited.png' class='heart' status='unfavorited'>")                           // add button to choose
        .addClass("btn choose")             // add button to choose
        .attr({
          "data-id": dummyArray[i].id,
          "petName": dummyArray[i].name,
          "petUrl": dummyArray[i].url,
          "petDescription": dummyArray[i].description,
          "petImage": allPetImages
          // dummyArray[i].photos[0].full
        });
      // .text("Choose");                                    // add button to choose

      var cardTitle = $("<h5>")
        .attr("class", "card-title")
        .html(dummyArray[i].name);
      cardTitle.append(cardButton);
      var animalInfo = $("<p>").attr("class", "card-text");
      if (dummyArray[i].description == null) {
        dummyArray[i].description = "No pet description available";
      }
      animalInfo.html(`
      ${dummyArray[i].description} <br><br>
      Age: ${dummyArray[i].age} | 
      Status: ${dummyArray[i].status} |
      Contact: ${dummyArray[i].contact.email} ${dummyArray[i].contact.phone} <br><br>
      ID Number: ${dummyArray[i].id} <br><br>
      <a href="${dummyArray[i].url}" target="_blank">More Info</a>`);
      cardBody.append(cardTitle);
      cardBody.append(animalInfo);
      newDiv.append(cardBody);
      $(".carousel-inner").append(newDiv);
    }
  }
}

function addFavorites2() {
  var custID = sessionStorage.getItem("customerId");
  var userName = sessionStorage.getItem("userName");
  $("#welcomeText").text(`Welcome ${userName}`);
  var favoritesArray = [];
  API.loadFavoritePets(custID).then(function (response) {
    console.log(response);
    favoritesArray = response;
    console.log(favoritesArray);
    if (favoritesArray.length === 0) {
      $("a.fave-caro-controls").css("display", "none");
      var noFaveImage = $("<img src='./images/spiderpug.png'>");
      $("#favorited .carousel-inner").append(noFaveImage);
      $(".card-header").append($("<h2>").html("No pets currently favorited"));
      $(".petInfo").append($("<p>").html(
        `Search for pets and save your favorites using our <a href="/search">search page.</a>`
      ))
    }
    else {
      var recentFave = favoritesArray[favoritesArray.length - 1];
      // console.log(recentFave);
      for (var i = 0; i < favoritesArray.length; i++) {
        // adds images below card
        var images = favoritesArray[i].petImage.split(',');
        var img = $("<img src='" + images[0] + "'>");
        img.attr({
          "class": "favorite-img",
          "data-id": favoritesArray[i].id
        });
        $("#favorites-card-container").prepend(img);
        // console.log(img.data("id"));
      }

      for (var e = 0; e < images.length; e++) {
        var caroImgDiv = $("<div>");
        if (e === 0) {
          caroImgDiv.attr("class", "carousel-item active");
        } else {
          caroImgDiv.attr("class", "carousel-item")
        }
        var caroImg = $("<img src='" + images[e] + "'>");
        caroImgDiv.append(caroImg);

        $("#favorited .carousel-inner").append(caroImgDiv);
      }
      if (images.length === 1) {
        $("a.fave-caro-controls").css("display", "none");
      }
      else {
        $("a.fave-caro-controls").css("display", "flex");
      }
      if (recentFave.description == null) {
        recentFave.description = "No pet description available";
      }
      $(".card-header").append($("<h2>").html(recentFave.petName));
      $(".petInfo").append($("<p>").html(
        `${recentFave.description}<br>
        <a href="${recentFave.url}" target="_blank">More Information</a>`
      ))
    }

  })
}


$(document).on("click", ".favorite-img", function () {
  var thisPet = $(this).data("id");
  var custID = sessionStorage.getItem("customerId");
  API.loadFavoritePets(custID).then(function (response) {
    for (var i = 0; i < response.length; i++) {
      if (response[i].id == thisPet) {
        var clickedPic = response[i];
      }
    }
    console.log(clickedPic);
    $(".card-header").empty();
    $(".petInfo").empty();
    $("#favorited .carousel-inner").empty()
    $(".card-header").append($("<h2>").text(clickedPic.petName));
    if (clickedPic.description == null) {
      clickedPic.description = "No pet description available";
    }
    $(".petInfo").append($("<p>").html(
      `${clickedPic.description}<br>
        <a href="${clickedPic.url}" target="_blank">More Information</a>`
    ))
    var images = clickedPic.petImage.split(',');
    console.log(images);
    for (var e = 0; e < images.length; e++) {
      var caroImgDiv = $("<div>");
      if (e === 0) {
        caroImgDiv.attr("class", "carousel-item active");
      } else {
        caroImgDiv.attr("class", "carousel-item")
      }
      var caroImg = $("<img src='" + images[e] + "'>");
      caroImgDiv.append(caroImg);

      $("#favorited .carousel-inner").append(caroImgDiv);
    }
    if (images.length === 1) {
      $("a.fave-caro-controls").css("display", "none");
    }
    else {
      $("a.fave-caro-controls").css("display", "flex");
    }
  })
})

function popCardInfo() {
  for (var e = 0; e < images.length; e++) {
    console.log(images[e]);
    var caroImgDiv = $("<div>");
    if (e === 0) {
      caroImgDiv.attr("class", "carousel-item active");
    } else {
      caroImgDiv.attr("class", "carousel-item")
    }
    var caroImg = $("<img src='" + images[e] + "'>");
    caroImgDiv.append(caroImg);

    $("#favorited .carousel-inner").append(caroImgDiv);
  }

  $(".card-header").append($("<h2>").html(recentFave.petName));
  $(".petInfo").append($("<p>").html(
    `${recentFave.description}<br>
    <a href="${recentFave.url}" target="_blank">More Information</a>`))
}

addFavorites2();


function addIndicators() {
  // $(".carousel-indicators").empty();
  var dummyArray = petsFoundObject.petsFound;   // petsFoundObject is a global set in apiRoutes.js /searchPets route
  for (var i = 0; i < dummyArray.length; i++) {
    // console.log(i);
    if (i === 0) {
      var listItem = $("<li>")
        .attr("data-target", "#searchCaro")
        .attr("data-slide-to", i)
        .attr("class", "active");
    } else {
      var listItem = $("<li>")
        .attr("data-target", "#searchCaro")
        .attr("data-slide-to", i);
    }
    $(".carousel-indicators").append(listItem);
  }
}

// ** On-click events, per convention all call handlers in indexOnClickHandlers.js
//  **ADDED BY EO
$signUpSubmitBtn.on("click", function () {
  handleSignUpSubmitBtnClick();
  // window.location.href = "/homepage";
});

$logInSubmitBtn.on("click", function () {
  console.log('log in button clicked');
  handleLoginSubmitBtnClick();
  // window.location.href = "/homepage";
  console.log("customerId returned", sessionStorage.getItem("customerId"));
  console.log("Customer Id and username returned", sessionStorage.getItem("customerId"), "userName: ", sessionStorage.getItem("userName"));

});

// ** Event listeners for Friendly Neighborhood Pet Finder
$carouselContainer.on("click", ".choose", handleChooseBtnClick);
$loadPetTypesBtn.on("click", handleLoadPetTypesBtnClick);
$searchPetsBtn.on("click", handleSearchPetsBtnClick);
$petFoundList.on("click", ".choose", handleChooseBtnClick);
$searchSubmitBtn.on("click", handleSearchSubmitBtnClick);
$logOutBtn.on("click", handleLogOutBtnClick);
$homePageBtn.on("click", handleHomePageBtnClick);
$searchPageBtn.on("click", handleSearchPageBtnClick);
$deleteChosenPetBtn.on("click", function () {
  handleDeleteChosenPetBtnClick($(this).data("id"));
});
