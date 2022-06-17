"use strict";

const app = Vue.createApp({
  data() {
    return {
      carMake: [
        `Toyota`,
        `Honda`,
        `Chevrolet`,
        `Ford`,
        `Mercedes-Benz`,
        `Jeep`,
        `BMW`,
        `Porsche`,
        `Subaru`,
        `Nissan`,
        `Cadillac`,
        `Volkswagen`,
        `Lexus`,
        `Audi`,
        `Ferrari`,
        `Volvo`,
        `Jaguar`,
        `GMC`,
        `Buick`,
        `Acura`,
        `Bentley`,
        `Dodge`,
        `Hyundai`,
        `Lincoln`,
        `Mazda`,
        `Land Rover`,
        `Ram`,
        `Kia`,
        `Chrysler`,
        `Pontiac`,
        `Infiniti`,
        `Mitsubishi`,
        `Oldsmobile`,
        `Maserati`,
        `Aston Martin`,
        `Suzuki`,
      ],
      make: ``,
      model: ``,
      year: ``,
      transmission: ``,
      userMPG: ``,
      userAddress: ``,
      userLocation: ``,
      userState: ``,
      destination: ``,
      destinationCity: ``,
      destinationCoords: ``,
      distance: `0`,
      gasPrice: ``,
      totalCost: `Round trip cost`,
      // add option for a one way trip //
    };
  },
  methods: {
    getMake() {
      let sortedCarMake = this.carMake.sort();
      let searchMake = document.getElementById(`make`);
      for (let i of sortedCarMake) {
        if (
          i.toLowerCase().startsWith(searchMake.value.toLowerCase()) &&
          searchMake.value != ``
        ) {
          let listItem = document.createElement(`li`);
          listItem.classList.add(`list-items`);
          listItem.setAttribute(`onclick`, `displayNames('` + i + `')`);
          let result = `<b>` + i.substr(0, searchMake.value.length) + `</b>`;
          result += i.substr(searchMake.value.length);
          listItem.innerHTML = result;
          document.querySelector(`.list`).appendChild(listItem);
        }
      }
      function displayNames(value) {
        searchMake.value = value;
      }
    },
    displayNames(value) {
      this.searchMake.value = value;
    },
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
          console.log(data);
        })
        .catch((error) => {
          console.log(`Error:`, error);
        });
    },
    calculateDistance() {
      // fetch starting address //

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

          // fetch destination address //

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

              // calculate distance between user's location and destination //

              fetch(
                `http://www.mapquestapi.com/directions/v2/route?key=VWtLJjUxEFuyRfoQSeoWjGBFJHVhossb&from=${this.userLocation}&to=${this.destinationCoords}`,
                {
                  method: "GET",
                  contentType: "application/json",
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  this.distance = data.route.distance.toFixed(1);
                });
            });
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
          // trim decimals //
          let finalCost = (this.distance / this.userMPG) * (this.gasPrice * 2);
          this.totalCost = `$` + finalCost.toFixed(2);
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
