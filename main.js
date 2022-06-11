"use strict";

const app = Vue.createApp({
  data() {
    return {
      make: ``,
      model: ``,
      year: ``,
      transmission: ``,
      location: ``,
      destination: ``,
    };
  },
  methods: {
    getMPG() {
      let mpg = fetch(
        `https://api.api-ninjas.com/v1/cars?limit=30&make=` +
          this.make +
          `&model=` +
          this.model +
          `&year=` +
          this.year +
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
          console.log(`Success:`, data);
        })
        .catch((error) => {
          console.log(`Error:`, error);
        });
      return mpg;
    },
  },
});

app.mount(`#app`);

// const make = `toyota`;
// const model = `camry`;
// const year = `2019`;
// const transmission = `a`;

// fetch(
//   `https://api.api-ninjas.com/v1/cars?limit=30&make=` +
//     make +
//     `&model=` +
//     model +
//     `&year=` +
//     year +
//     `&transmission=` +
//     transmission,
//   {
//     method: "GET",
//     headers: {
//       "X-api-key": "e3pABTjrjLIo+HVopxGdwg==FrZ916Y3HqlCYG79",
//     },
//     contentType: "application/json",
//   }
// )
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(`Success:`, data);
//   })
//   .catch((error) => {
//     console.log(`Error:`, error);
//   });

// const make = `jeep`;

// fetch(`https://api.api-ninjas.com/v1/cars?make=toyota&model=camry&year=2019`, {
//   method: "GET",
//   headers: {
//     "X-api-key": "e3pABTjrjLIo+HVopxGdwg==FrZ916Y3HqlCYG79",
//   },
//   contentType: "application/json",
// })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(`Success:`, data);
//   })
//   .catch((error) => {
//     console.log(`Error:`, error);
//   });
