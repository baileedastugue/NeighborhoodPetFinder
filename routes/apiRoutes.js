/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable prettier/prettier */

require("dotenv").config();
var db = require("../models");
var axios = require("axios");

module.exports = function (app) {
  // Get all examples, this was original boilerplate test calls
  app.get("/api/examples", function (req, res) {
    db.ChosenPet.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a newly chosen pet
  app.post("/api/choosePet", function (req, res) {
    console.log("req.body", req.body);
    db.ChosenPet.create({
      petId: req.body.petId,
      customerId: req.body.customerId,
      petImage: req.body.petImage,
      description: req.body.description,
      petName: req.body.petName,
      url: req.body.url
    }).then(function (dbChosenPets) {
      res.json(dbChosenPets);
    });
  });


  // Delete an example by id, original boilerplate testing route for deletes, not used in app
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });


  // PETFINDER Load Pet Types page and pass in an example
  // need Petsaver client_id and client_secret to request token, then request types, returns petTypes object.
  app.get("/api/loadPetTypes", function (req, res) {
    var credentialString =
      '{"grant_type":"client_credentials","client_id":"' +
      process.env.PETFINDER_CLIENT_ID +
      '","client_secret":"' +
      process.env.PETFINDER_CLIENT_SECRET +
      '"}';
    axios({
      headers: {
        "Content-Type": "application/json",
      },
      data: credentialString,
      method: "POST",
      url: "https://api.petfinder.com/v2/oauth2/token"
    })
      .then(function (petFinderTokenResponse) {
        process.env.PETFINDER_ACCESS_TOKEN = petFinderTokenResponse.data.access_token;
        console.log(process.env.PETFINDER_ACCESS_TOKEN);
        axios({
          headers: {
            Authorization: "Bearer " + process.env.PETFINDER_ACCESS_TOKEN
          },
          method: "GET",
          url: "https://api.petfinder.com/v2/types"
        })
          .then(function (typeObject) {
            var petTypeObject = {
              petType: typeObject.data.types
            };
            res
              .header("Authentication", process.env.PETFINDER_ACCESS_TOKEN)  //send back token as well
              .json(petTypeObject)
              .end();
          })
          .catch(function (errorType) {
            console.log("errorType:\n", errorType);
          });
      })
      .catch(function (errorToken) {
        if (errorToken.response) {
          console.log("errorToken: \n", errorToken);
        }
      });
  });


  // get matching pets from petFinder, called from indexApiCalls.js API.searchPets
  app.get("/api/searchPets", function (req, res) {
    console.log("params", req.query);
    var queryString = `?type=${req.query.type}&coat=${req.query.coat}&size=${req.query.size}` +
      `&breed=${req.query.breed}&age=${req.query.age}&gender=${req.query.gender}`;
    console.log("queryString", queryString);
    console.log("token", process.env.PETFINDER_ACCESS_TOKEN);
    axios({
      headers: {
        Authorization: "Bearer " + process.env.PETFINDER_ACCESS_TOKEN
        // Authorization: "Bearer " + globalPetFinderToken
      },
      method: "GET",
      url: "https://api.petfinder.com/v2/animals" + queryString,
      // params: req.query
    })
      .then(function (searchPetsResponse) {
        // console.log(searchPetsResponse);
        var petsFoundObject = {
          petsFound: searchPetsResponse.data.animals
        };
        res.send(petsFoundObject).end();
      })
      .catch(function (error) {
        console.log("errorToken: \n", error);
      });
  });

  // Create a 'Sign Up' record for new Customer in Customer table
  app.post("/api/signup", function (req, res) {
    console.log("req.body", req.body);
    db.Customer.create({
      userFirstName: req.body.userFirstName,
      userLastName: req.body.userLastName,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userZip: req.body.userZip,
      userPassword: req.body.userPassword
    }).then(function (dbCustomers) {
      console.log("dbCustomers:", dbCustomers);
      res.json(dbCustomers);
    })
      .catch(function (err) {
        console.log("error response object: ", err);
        res.json(err);
      })
      ;
  });


  // Get login data for this user, if match 1st object in array is user
  app.get("/api/login", function (req, res) {
    console.log("req.query", req.query);
    db.Customer.findAll({
      where: {
        userName: req.query.userName,
        userPassword: req.query.userPassword
      }
    }).then(function (dbCustomers) {
      res.json(dbCustomers);
    });
  });

  //  Delete a chosen pet from the ChosenPet database
  app.delete("/api/deletePet/:id", function (req, res) {
    db.ChosenPet.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(function (dbChosenPets) {
        console.log("ChosenPet successfully deleted from database");
        res.json(dbChosenPets);
      })
  });

  //  Load the current user/customers favorite pets into the carousel on the homepage
  app.get("/api/loadfavorites/:id", function (req, res) {
    console.log(req.params.id);
    db.ChosenPet.findAll({
      where: {
        customerId: req.params.id
      }
    }).then(function (dbChosenPets) {
      res.json(dbChosenPets);
    });
  });
};



