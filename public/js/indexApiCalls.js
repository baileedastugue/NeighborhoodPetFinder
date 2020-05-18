/* eslint-disable prettier/prettier */
/* eslint-disable indent */

// The API object contains methods for each kind of request we'll make
// module.exports = function () {
var API = {
    loadPetTypes: function () {
        return $.ajax({
            type: "GET",
            url: "api/loadPetTypes/"
        })
            .then(function (petTypes) {
                // console.log("petTypes: ", petTypes);
                petTypesObject = petTypes;
            })
            .catch(function (err) {
                console.log("error getting types from PetFinder: ", err);
            });
    },
    searchPets: function (query) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "GET",
            url: "api/searchPets",
            data: query
        })
            .then(function (petsFound) {
                // console.log("petTypes: ", petsFound);
                petsFoundObject = petsFound;
            })
            .catch(function (err) {
                console.log("error getting types from PetFinder: ", err);
            });
    },
    choosePet: function (choosePetRequestObject) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "api/choosePet",
            data: JSON.stringify(choosePetRequestObject)
        });
    },
    signup: function (customerObject) {
        return $.ajax({
            type: "POST",
            url: "api/signup",
            data: customerObject
        });
    },
    login: function (customerObject) {

        console.log("cutomer object", customerObject);

        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "GET",
            url: "api/login",
            data: customerObject
        });
    },
    deletePet: function (Id) {
        return $.ajax({
            method: "DELETE",
            url: "/api/deletePet/" + Id
        });
    },
    loadFavoritePets: function (customerID) {
        return $.ajax({
            method: "GET",
            url: "/api/loadfavorites/" + customerID,
        });
    }
};