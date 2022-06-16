"use strict";

const app = Vue.createApp({
  data() {
    return {
      make: ``,
      model: ``,
      year: ``,
      transmission: ``,
      userMPG: ``,
      userAddress: ``,
      userLocation: ``,
      destination: ``,
      destinationCoords: ``,
      distance: ``,
      userState: ``,
      destinationCity: ``,
      gasPrice: ``,
      totalCost: ``,
    };
  },
  methods: {
    getMPG() {
      let mpg = fetch(
        `https://api.api-ninjas.com/v1/cars?limit=30&year=` +
          this.year +
          `&make=` +
          this.make +
          `&model=` +
          this.model.replaceAll(` `, `+`) +
          `&transmission=` +
          this.transmission,
        {
          method: "GET",
          headers: {
            "X-api-key": "e3pABTjrjLIo+HVopxGdwg==FrZ916Y3HqlCYG79",
          },
          contentType: "application/json",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const [userVehicle] = data;
          this.userMPG = userVehicle[`combination_mpg`];
          console.log(`Success:`, data);
        })
        .catch((error) => {
          console.log(`Error:`, error);
        });
      return mpg;
    },
    getUserLocation() {
      const address = this.userAddress.replaceAll(` `, `+`);
      fetch(
        `http://www.mapquestapi.com/geocoding/v1/address?key=VWtLJjUxEFuyRfoQSeoWjGBFJHVhossb
        &location=${address}`,
        {
          method: "GET",
          contentType: "application/json",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.userState = data.results[0].locations[0].adminArea3;
          let lat = data.results[0].locations[0].displayLatLng.lat;
          let lng = data.results[0].locations[0].displayLatLng.lng;
          this.userLocation = `${lat},${lng}`;
        })
        .catch((error) => {
          console.log(`Error:`, error);
        });
    },
    getDestination() {
      const destination = this.destination.replaceAll(` `, `+`);
      fetch(
        `http://www.mapquestapi.com/geocoding/v1/address?key=VWtLJjUxEFuyRfoQSeoWjGBFJHVhossb
        &location=${destination}`,
        {
          method: "GET",
          contentType: "application/json",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          this.destinationCity = data.results[0].locations[0].adminArea3;
          let lat = data.results[0].locations[0].displayLatLng.lat;
          let lng = data.results[0].locations[0].displayLatLng.lng;
          this.destinationCoords = `${lat},${lng}`;
        })
        .catch((error) => {
          console.log(`Error:`, error);
        });
    },
    calculateDistance() {
      fetch(
        `http://www.mapquestapi.com/directions/v2/route?key=VWtLJjUxEFuyRfoQSeoWjGBFJHVhossb&from=${this.userLocation}&to=${this.destinationCoords}`,
        {
          method: "GET",
          contentType: "application/json",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(data.route.distance);
          this.distance = data.route.distance;
        })
        .catch((error) => {
          console.log(`Error:`, error);
        });
    },
    calculateCost() {
      fetch(
        `https://api.collectapi.com/gasPrice/stateUsaPrice?state=${this.userState}`,
        {
          method: "GET",
          contentType: "application/json",
          headers: {
            authorization:
              "apikey 4LTK6ui9IzksjBgCY2VIXt:7FX543FJ3ax3CFszotw3ur",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          this.gasPrice = data.result.state.gasoline;
          this.totalCost = (this.distance / this.userMPG) * (this.gasPrice * 2);
        })
        .catch((error) => {
          console.log(`Error:`, error);
        });
    },
  },
});

app.mount(`#app`);

// fetch(
//   `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyAJJIxQjX1zxfAa8IhL3nsBhelzIR7gWDY&input=chicago&components=country:us`,
//   {
//     method: "GET",
//     headers: {
//       "Access-Control-Allow-Credentials": true,
//       "Access-Control-Allow-Headers": `application/json`,
//       "Access-Control-Allow-Methods": "GET, POST",
//       "Access-Control-Allow-Origin": "*",
//     },
//     // contentType: "application/json",
//   }
// )
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(`Success:`, data);
//   })
//   .catch((error) => {
//     console.log(`Error:`, error);
//   });

// apikey 4LTK6ui9IzksjBgCY2VIXt:7FX543FJ3ax3CFszotw3ur

// fetch(`https://api.collectapi.com/gasPrice/usaCitiesList`, {
//   method: "GET",
//   contentType: "application/json",
//   headers: {
//     authorization: "apikey 4LTK6ui9IzksjBgCY2VIXt:7FX543FJ3ax3CFszotw3ur",
//   },
// })
//   .then((response) => response.json())
//   .then((data) => {
//     // console.log(data);
//     console.log(data);
//   })
//   .catch((error) => {
//     console.log(`Error:`, error);
//   });
