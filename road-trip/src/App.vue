<template>
  <div id="top-shape"></div>
  <div v-if="loading" id="clouds" class="loading"></div>
  <img
    v-if="!loading"
    src="./assets/car.svg"
    class="icon-car"
    alt="Icon of a cartoon car."
  />
  <img
    v-if="loading"
    src="./assets/car-animated.svg"
    class="icon-car"
    alt="Icon of a cartoon car."
  />
  <select class="select-trip" v-model="selectTrip">
    <option value="" selected>&nbsp; Trip type</option>
    <option value="one way">One-Way</option>
    <option value="round trip">Round trip</option>
  </select>
  <section class="section-location">
    <label for="userAddress">Address</label>
    <input
      class="input-location location-user"
      type="text"
      name="userAdress"
      v-model="userAddress"
      placeholder="Enter address"
    />

    <li class="stop-container" key="stop">
      <label for="stopAddress">First stop</label>
      <input
        class="input-location location-stop"
        type="text"
        name="stopAdress"
        v-model="stopAddress"
        placeholder="Enter address"
      />
    </li>

    <label for="destination" class="move">Destination</label>
    <input
      class="input-location location-destination move"
      @blur="calculateDistance()"
      type="text"
      name="destination"
      v-model="destination"
      placeholder="Enter destination"
    />
    <button class="btn-stop move" @click="addStop()">Add stop</button>
  </section>
  <section class="section-calculate move">
    <div class="distance">{{ distance }}<span class="miles"> mi</span></div>
  </section>

  <section class="section-vehicle move">
    <select class="input-vehicle" v-model="year">
      <option value="">Year</option>
      <option value="2021">2021</option>
      <option value="2020">2020</option>
      <option value="2019">2019</option>
      <option value="2018">2018</option>
      <option value="2017">2017</option>
      <option value="2016">2016</option>
      <option value="2015">2015</option>
      <option value="2014">2014</option>
      <option value="2013">2013</option>
      <option value="2012">2012</option>
      <option value="2011">2011</option>
      <option value="2010">2010</option>
      <option value="2009">2009</option>
      <option value="2008">2008</option>
      <option value="2007">2007</option>
    </select>
    <div class="make-list">
      <input
        @input="getMake"
        @focus="autoComplete = true"
        @blur="autoComplete = false"
        class="input-vehicle"
        type="text"
        v-model="make"
        placeholder="Make"
        autocomplete="off"
      />
      <div
        class="car-makes"
        v-if="filteredCarMake && autoComplete && make !== ``"
      >
        <ul>
          <li v-for="car in filteredCarMake" @mousedown="setMake(car)">
            {{ car }}
          </li>
        </ul>
      </div>
    </div>

    <input
      class="input-vehicle"
      type="text"
      v-model="model"
      placeholder="Model"
    />
    <select class="input-vehicle" v-model="transmission">
      <option class="placeholder" value="">Transmission</option>
      <option value="a">Automatic</option>
      <option value="m">Manual</option>
    </select>
  </section>

  <button
    class="btn-total-cost"
    @click="
      getMPG();
      calculateCost();
    "
  >
    Go!
  </button>
  <button class="btn-new-trip" @click="newTrip()">New trip</button>
  <div class="total-cost">{{ totalCost }}</div>
  <div id="bottom-shape"></div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      make: ``,
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
        `Suzuki`,
      ],
      filteredCarMake: [],
      model: ``,
      carModel: [],
      filteredCarModel: [
        // Audi //
        `100`,
        `Cabriolet`,
        `90`,
        `100 wagon`,
        `A4`,
        `A6`,
        `A3`,
        `R8 rwd`,
        `R8 Spyder rwd`,
        `R8 2wd`,
        `100 Quattro Qagon`,
        `90 quattro`,
        `S4`,
        `V8`,
        `A6 Quattro`,
        `S6`,
        `4000s Quattro`,
        `A8`,
        // Acura //
        `Integra`,
        `Legend`,
        `Vigor`,
        `2.5TL`,
        `3.5RL`,
        `TLX fwd a-spec`,
        `TLX fwd`,
        `RDX fwd`,
        `RDX fwd a-spec`,
        `RLX`,
        `MDX fwd`,
        `ILX`,
        `NSX`,
        `SLX`,
        `MDX`,
        `MDX 4wd`,
        `RL`,
        `RDX 4wd`,
        `TL 4wd`,
        `ZDX 4wd`,
        // BMW //
        `X1 Sdrive28i`,
        `X2 Sdrive28i`,
        `228i Gran Coupe`,
        `740i`,
        `740iL`,
        `750iL`,
        `525i Touring`,
        `318i Convertable`,
        `325i Convertable`,
        `318i/318iS`,
        `325i/325iS`,
        `850Ci`,
        `850CSi`,
        `525i`,
        `530i`,
        `540i`,
        `740i`,
        `740iL`,
        `750iL`,
        `530i Touring`,
        `325xi`,
        `325xi Sport Wagon`,
        `X5`,
        `330xi`,
        // Buick //
        `Century`,
        `Regal`,
        `Riviera`,
        `Lesabre`,
        `Park Avenue`,
        `Century Wagon`,
        `Skylark`,
        `Encore`,
        `Lacrosse Eassaist`,
        `Lacrosse`,
        `Cascada`,
        `Envision fwd`,
        `Enclave fwd`,
        `Roadmaster`,
        `Roadmaster Wagon`,
        `Coachbuilder Wagon`,
        `Rainer 2wd`,
        `Rendezvous awd`,
        `Rainer awd`,
        `Terraza awd`,
        `Enclave awd`,
        `Lacrosse awd`,
        `Encore awd`,
        `Regal awd`,
        `Regal TourX awd`,
        `Envision awd`,
        // Chevrolet //
        `Lumina`,
        `Cavalier Wagon`,
        `Lumina/apv Minivan 2wd`,
        `Cavalier`,
        `Sprint`,
        `Beretta`,
        `Corsica`,
        `Lumina Minivan 2wd`,
        `Equinox fwd`,
        `Impala`,
        `Malibu`,
        `Traverse fwd`,
        `Cruze`,
        `Cruze Premier`,
        `Sonic`,
        `Cruze Hatchback`,
        `Cruze Premier Hatchback`,
        `Sonic A5`,
        `Sonic 5`,
        `Volt`,
        `Malibu Hybrid`,
        `Spark`,
        `Spark Activ`,
        `Caprice`,
        `Caprice Wagon`,
        `S10 Pickup 2wd`,
        `C1500 Pickup 2wd`,
        `Pickup 2500 2wd`,
        `Suburban C10 2wd`,
        `Corvette`,
        `Camaro`,
        `Silverado 15 Hybrid 2wd`,
        `Silverado C15 Cab Chassis 2wd`,
        `Tahoe C1500 2wd`,
        `Suburban C1500 2wd`,
        `Colorado 2wd`,
        `Colorado Cab Chassis 2wd`,
        `K1500 Pickup 4wd`,
        `Pickup 2500 4wd`,
        `S10 Pickup 4wd`,
        `Astro awd (cargo)`,
        `Astro awd (passenger)`,
        `Blazer 1500 4wd`,
        `Suburban 1500 4wd`,
        `S10 Blazer 4wd`,
        `K10 Blazer 4wd`,
        `Silverado K15 4wd`,
        `Colorado 4wd`,
        `Colorado Cab Chassis inc 4wd`,
        `Colorado Crew Cab 4wd`,
        `Silverado 15 Hybrid 4wd`,
        `Tahoe 1500 4wd`,
        `Tahoe Hybrid 4wd`,
        `Avalanche 1500 4wd`,
        `Colorado ZR2 4wd`,
        // Cadillad //
        ``,
      ],
      autoComplete: false,
      year: ``,
      transmission: ``,
      userMPG: ``,
      selectTrip: ``,
      userAddress: ``,
      userLocation: ``,
      userState: ``,
      destination: ``,
      destinationCity: ``,
      destinationCoords: ``,
      stopAdded: false,
      stopAddress: ``,
      stopCoords: ``,
      distance: `0`,
      gasPrice: ``,
      totalCost: `$0`,
      loading: false,
      // add option for a one way trip //
    };
  },
  methods: {
    setMake(make) {
      this.make = make;
      this.autoComplete = false;
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
          this.userState = data.results[0].locations[0].adminArea3;
          let lat = data.results[0].locations[0].displayLatLng.lat;
          let lng = data.results[0].locations[0].displayLatLng.lng;
          this.userLocation = `${lat},${lng}`;
        })
        .catch((error) => {
          console.log(`Error:`, error);
        });
    },
    getStopLocation() {
      const stopAddress = this.stopAddress.replaceAll(` `, `+`);
      fetch(
        `http://www.mapquestapi.com/geocoding/v1/address?key=VWtLJjUxEFuyRfoQSeoWjGBFJHVhossb
          &location=${stopAddress}`,
        {
          method: "GET",
          contentType: "application/json",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          let lat = data.results[0].locations[0].displayLatLng.lat;
          let lng = data.results[0].locations[0].displayLatLng.lng;
          this.stopCoords = `${lat},${lng}`;
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
    addStop() {
      let stopBtn = document.querySelector(`.btn-stop`);
      let moveElements = document.querySelectorAll(`.move`);
      let stopContainer = document.querySelector(`.stop-container`);
      this.stopAdded = !this.stopAdded;
      if (this.stopAdded) {
        stopBtn.innerHTML = `Remove stop`;
        stopContainer.classList.remove(`delayed-stop-removed`);
        stopContainer.classList.add(`stop-added`);
        stopContainer.classList.remove(`stop-removed`);
        moveElements.forEach((element) => {
          element.classList.add(`move-down`);
          element.classList.remove(`move-up`);
        });
      } else if (!this.stopAdded) {
        stopBtn.innerHTML = `Add stop`;
        stopContainer.classList.remove(`stop-added`);
        stopContainer.classList.add(`stop-removed`);
        setTimeout(() => {
          stopContainer.classList.add(`delayed-stop-removed`);
        }, 500);
        moveElements.forEach((element) => {
          element.classList.remove(`move-down`);
          element.classList.add(`move-up`);
        });
      }
    },
    calculateDistance() {
      // fetch starting address //
      if (!this.stopAdded) {
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
                    console.log(this.distance);
                  });
              });
          });
      } else if (this.stopAdded) {
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
            this.userState = data.results[0].locations[0].adminArea3;
            let lat = data.results[0].locations[0].displayLatLng.lat;
            let lng = data.results[0].locations[0].displayLatLng.lng;
            this.userLocation = `${lat},${lng}`;

            // fetch stop address //

            const stop = this.stopAddress.replaceAll(` `, `+`);
            fetch(
              `http://www.mapquestapi.com/geocoding/v1/address?key=VWtLJjUxEFuyRfoQSeoWjGBFJHVhossb
                &location=${stop}`,
              {
                method: "GET",
                contentType: "application/json",
              }
            )
              .then((response) => response.json())
              .then((data) => {
                let lat = data.results[0].locations[0].displayLatLng.lat;
                let lng = data.results[0].locations[0].displayLatLng.lng;
                this.stopCoords = `${lat},${lng}`;
              })
              .catch((error) => {
                console.log(`Error:`, error);
              });

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
                  `http://www.mapquestapi.com/directions/v2/route?key=VWtLJjUxEFuyRfoQSeoWjGBFJHVhossb&ambiguous=check&from=${this.userLocation}&to=${this.stopCoords}&to=${this.destinationCoords}`,
                  {
                    method: "GET",
                    contentType: "application/json",
                  }
                )
                  .then((response) => response.json())
                  .then((data) => {
                    this.distance = data.route.distance.toFixed(1);
                    console.log(this.distance);
                  });
              });
          });
      }
    },
    calculateCost() {
      this.loading = true;
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
          let finalCost = (this.distance / this.userMPG) * this.gasPrice;
          if (this.selectTrip === `one way`) {
            this.totalCost = `$` + finalCost.toFixed(2);
          } else if (this.selectTrip === `round trip`) {
            this.totalCost = `$` + finalCost.toFixed(2) * 2;
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log(`Error:`, error);
          this.loading = false;
        });
    },
    newTrip() {
      (this.make = ``),
        (this.model = ``),
        (this.year = ``),
        (this.transmission = ``),
        (this.userMPG = ``),
        (this.selectTrip = ``),
        (this.userAddress = ``),
        (this.userLocation = ``),
        (this.userState = ``),
        (this.destination = ``),
        (this.destinationCity = ``),
        (this.destinationCoords = ``),
        (this.stopAddress = ``),
        (this.stopCoords = ``),
        (this.distance = `0`),
        (this.gasPrice = ``),
        (this.totalCost = `$0`);
    },
  },
  computed: {
    getMake() {
      this.filteredCarMake = this.carMake.filter((make) => {
        return make.toLowerCase().startsWith(this.make.toLowerCase());
      });
    },
  },
};
</script>

<style scoped>
#top-shape {
  position: absolute;
  top: 0;
  height: 12vh;
  width: 100vw;
  background: linear-gradient(to bottom, #60b2ff, #7de0ff);
  border-top-left-radius: 6rem;
  border-bottom-right-radius: 6rem;
}

#bottom-shape {
  position: absolute;
  bottom: 0;
  height: 12vh;
  width: 100vw;
  background: linear-gradient(to top, #60b2ff, #7de0ff);
  border-bottom-left-radius: 6rem;
  border-top-right-radius: 6rem;
}

.select-trip {
  position: absolute;
  top: 3vh;
  left: 30vw;
  font-size: 1.6rem;
  text-align: center;
  line-height: 6vh;
  color: #333;
  border: none;
  border-radius: 3rem;
  box-shadow: none !important;
  margin: 0 auto;
  height: 6vh;
  width: 40%;
  z-index: 1;
}

.icon-car {
  height: 5rem;
  width: 8rem;
  align-self: center;
  justify-self: center;
  transform: scale(3.8);
  margin: -5rem 0 6rem 4.5rem;
  animation: carLoadIn 0.3s linear;
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-image: url(./assets/clouds.svg);
  background-size: cover;
  z-index: 100;
  opacity: 0.7;
  animation: cloudsLoadIn 0.3s linear;
}

@keyframes carLoadIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes cloudsLoadIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.7;
  }
}

*:focus {
  outline: none;
  box-shadow: 0 0.3rem 0.6rem 0rem rgba(72, 106, 209, 0.365);
}

label {
  display: block;
  align-self: flex-end;
  font-size: 1.2rem;
  color: #333;
  font-weight: 700;
  margin: 0.8rem 2rem;
}

input {
  box-shadow: 0 0.3rem 0.6rem 00rem rgba(51, 51, 51, 0.365);
}

select {
  box-shadow: 0 0.3rem 0.6rem 0rem rgba(51, 51, 51, 0.365);
}

ul {
  list-style: none;
}

li {
  text-align: center;
  font-size: 1.6rem;
  line-height: 3rem;
  /* font-weight: 700; */
  width: 16rem;
  height: 3rem;
  color: #333;
  background-color: white;
  border: 1px solid rgba(51, 51, 51, 0.396);
  cursor: pointer;
}

li:nth-child(n + 2) {
  border-top: none;
}

button {
  font-size: 1.6rem;
  text-align: center;
  height: 4rem;
  width: 12rem;
  color: white;
  background-color: #333;
  border: none;
  border-radius: 3rem;
  cursor: pointer;
}

.btn-new-trip {
  position: absolute;
  bottom: 3rem;
  right: 2rem;
  width: 9rem;
  color: #333;
  background-color: #c8f9d0;
  z-index: 1;
}

.btn-total-cost {
  position: absolute;
  bottom: 3rem;
  right: 12.2rem;
  width: 4rem;
  color: #333;
  background-color: #c8f9d0;
  z-index: 1;
}

.section-location {
  position: relative;
  display: block;
  margin: 0 auto;
  justify-content: center;
  padding: 0 2rem 0 2rem;
}

.input-location {
  font-size: 1.6rem;
  text-align: center;
  height: 4rem;
  width: 24rem;
  color: #333;
  background-color: white;
  border: none;
  border-radius: 3rem;
}

.location-user {
  margin-bottom: 1rem;
}

.location-destination {
  z-index: 10;
}

.btn-stop {
  display: block;
  margin: 2rem auto 0 auto;
}

.stop-container {
  position: absolute;
  list-style: none;
  text-align: left;
  margin-bottom: 4.8rem;
  font-size: 1.6rem;
  line-height: normal;
  font-weight: 700;
  color: #333;
  background-color: none;
  background: none;
  border: none;
  cursor: pointer;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
}
.move-up {
  transform: translateY(7.8rem);
  animation: moveUp 0.5s cubic-bezier(0.2, 0.2, 0.3, 1) forwards 0.4s;
}

.move-down {
  animation: moveDown 0.5s cubic-bezier(0.2, 0.2, 0.3, 1) forwards;
}

.stop-added {
  visibility: visible;
  pointer-events: all;
  animation: stop-in 0.4s forwards 0.3s;
}

.stop-removed {
  visibility: visible;
  pointer-events: all;
  animation: stop-out 0.4s forwards;
}

.delayed-stop-removed {
  visibility: hidden;
  pointer-events: none;
}

@keyframes stop-in {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  70% {
    transform: scale(1.15);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes stop-out {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  95% {
    opacity: 0;
    transform: translateX(12rem);
  }
  100% {
    opacity: 0;
    transform: translateX(0rem);
  }
}

@keyframes moveUp {
  0% {
  }
  100% {
    transform: translateY(0rem);
  }
}

@keyframes moveDown {
  0% {
  }
  100% {
    transform: translateY(7.8rem);
  }
}

.section-calculate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.distance {
  font-size: 1.6rem;
  text-align: center;
  line-height: 6vh;
  color: #333;
  /* background-color: white; */
  /* margin: 0 auto; */
  height: 6vh;
  width: 12rem;
  border-radius: 3rem;
}

.section-vehicle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 25%;
  justify-content: center;
  align-self: center;
  padding: 0 2rem 2rem 2rem;
  gap: 2rem;
}

.input-vehicle {
  font-size: 1.6rem;
  text-align: center;
  height: 4rem;
  width: 16rem;
  justify-self: center;
  color: #333;
  background-color: white;
  border: none;
  border-radius: 3rem;
}

.make-list {
  position: relative;
}

.car-makes {
  position: absolute;
  top: 4rem;
  left: 0;
}

.placeholder {
  color: rgba(51, 51, 51, 0.579);
}

.total-cost {
  position: absolute;
  bottom: 3vh;
  left: 35vw;
  font-size: 1.6rem;
  text-align: center;
  line-height: 6vh;
  color: #333;
  background-color: white;
  margin: 0 auto;
  height: 6vh;
  width: 30%;
  border-radius: 3rem;
  z-index: 1;
}
</style>
