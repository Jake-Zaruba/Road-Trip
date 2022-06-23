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
  <select class="select-trip current-selection" v-model="selectTrip">
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
        @focus="makeAutoComplete = true"
        @blur="makeAutoComplete = false"
        class="input-vehicle"
        type="text"
        v-model="make"
        placeholder="Make"
        autocomplete="off"
      />
      <div
        class="car-makes"
        v-if="filteredCarMake && makeAutoComplete && make !== ``"
      >
        <ul>
          <li v-for="car in filteredCarMake" @mousedown="setMake(car)">
            {{ car }}
          </li>
        </ul>
      </div>
    </div>

    <div class="model-list">
      <input
        @input="getModel"
        @focus="modelAutoComplete = true"
        @blur="modelAutoComplete = false"
        class="input-vehicle"
        type="text"
        v-bind="model"
        placeholder="Model"
        autocomplete="off"
      />
      <div
        class="car-models"
        v-if="filteredCarModel && modelAutoComplete && model !== ``"
      >
        <ul>
          <li
            v-for="carModel in filteredCarModel"
            @mousedown="setModel(carModel)"
          >
            {{ carModel }}
          </li>
        </ul>
      </div>
    </div>
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
  <div class="total-cost">&nbsp; {{ totalCost }}</div>
  <div id="bottom-shape"></div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      make: ``,
      carMake: [
        `Audi`,
        `Acura`,
        `BMW`,
        `Buick`,
        `Cadillac`,
        `Chevrolet`,
        `Chrysler`,
        `Dodge`,
        `Ford`,
        `GMC`,
        `Honda`,
        `Hyundai`,
        `Infiniti`,
        `Jeep`,
        `Kia`,
        `Lexus`,
        `Mazda`,
        `Nissan`,
        `Ram`,
        `Subaru`,
        `Toyota`,
        `Volkswagen`,
      ],
      filteredCarMake: [],
      model: ``,
      carModel: [
        {
          audi: [
            // Audi //
            `100`,
            `100 wagon`,
            `4000s Quattro`,
            `100 Quattro Wagon`,
            `90`,
            `90 quattro`,
            `A3`,
            `A4`,
            `A6`,
            `A6 Quattro`,
            `A8`,
            `Cabriolet`,
            `R8 2wd`,
            `R8 rwd`,
            `R8 Spyder rwd`,
            `S4`,
            `S6`,
            `V8`,
          ],
        },

        {
          acura: [
            // Acura //
            `2.5TL`,
            `3.5RL`,
            `Integra`,
            `ILX`,
            `Legend`,
            `MDX`,
            `MDX 4wd`,
            `MDX fwd`,
            `NSX`,
            `RDX 4wd`,
            `RDX fwd`,
            `RDX fwd a-spec`,
            `RL`,
            `RLX`,
            `SLX`,
            `TL 4wd`,
            `TLX fwd a-spec`,
            `TLX fwd`,
            `Vigor`,
            `ZDX 4wd`,
          ],
        },

        {
          bmw: [
            // BMW //
            `228i Gran Coupe`,
            `318i/318iS`,
            `318i Convertable`,
            `325xi`,
            `325i Convertable`,
            `325xi Sport Wagon`,
            `330xi`,
            `325i/325iS`,
            `525i`,
            `525i Touring`,
            `530i`,
            `530i Touring`,
            `540i`,
            `740i`,
            `740iL`,
            `750iL`,
            `850Ci`,
            `850CSi`,
            `X1 Sdrive28i`,
            `X2 Sdrive28i`,
            `X5`,
          ],
        },

        {
          buick: [
            // Buick //
            `Cascada`,
            `Century`,
            `Century Wagon`,
            `Coachbuilder Wagon`,
            `Encore`,
            `Enclave fwd`,
            `Envision fwd`,
            `Envision awd`,
            `Enclave awd`,
            `Encore awd`,
            `Lacrosse`,
            `Lacrosse awd`,
            `Lacrosse Eassaist`,
            `Lesabre`,
            `Park Avenue`,
            `Rainer 2wd`,
            `Rainer awd`,
            `Regal`,
            `Regal awd`,
            `Regal TourX awd`,
            `Rendezvous awd`,
            `Riviera`,
            `Roadmaster`,
            `Roadmaster Wagon`,
            `Skylark`,
            `Terraza awd`,
          ],
        },

        {
          chevrolet: [
            // Chevrolet //
            `Astro awd (cargo)`,
            `Astro awd (passenger)`,
            `Avalanche 1500 4wd`,
            `Beretta`,
            `Blazer 1500 4wd`,
            `C1500 Pickup 2wd`,
            `Camaro`,
            `Caprice`,
            `Caprice Wagon`,
            `Cavalier`,
            `Cavalier Wagon`,
            `Colorado 2wd`,
            `Colorado 4wd`,
            `Colorado Cab Chassis 2wd`,
            `Colorado Cab Chassis inc 4wd`,
            `Colorado Crew Cab 4wd`,
            `Colorado ZR2 4wd`,
            `Corsica`,
            `Corvette`,
            `Cruze`,
            `Cruze Hatchback`,
            `Cruze Premier`,
            `Cruze Premier Hatchback`,
            `Equinox fwd`,
            `Impala`,
            `K10 Blazer 4wd`,
            `K1500 Pickup 4wd`,
            `Lumina`,
            `Lumina/apv Minivan 2wd`,
            `Lumina Minivan 2wd`,
            `Malibu`,
            `Malibu Hybrid`,
            `Pickup 2500 2wd`,
            `Pickup 2500 4wd`,
            `S10 Blazer 4wd`,
            `S10 Pickup 2wd`,
            `S10 Pickup 4wd`,
            `Silverado 15 Hybrid 2wd`,
            `Silverado 15 Hybrid 4wd`,
            `Silverado C15 Cab Chassis 2wd`,
            `Silverado K15 4wd`,
            `Sonic`,
            `Sonic A5`,
            `Sonic 5`,
            `Spark`,
            `Sprint`,
            `Spark Activ`,
            `Suburban C10 2wd`,
            `Suburban C1500 2wd`,
            `Suburban 1500 4wd`,
            `Tahoe C1500 2wd`,
            `Tahoe 1500 4wd`,
            `Tahoe Hybrid 4wd`,
            `Traverse fwd`,
            `Volt`,
          ],
        },

        {
          cadillac: [
            // Cadillac //
            `ATS awd`,
            `ATS-V`,
            `Catera`,
            `Cimarron`,
            `Commercial Chassis`,
            `CT6`,
            `CT6 awd`,
            `CTS`,
            `CTS awd`,
            `CTS-V`,
            `Deville`,
            `Deville/Concourse`,
            `Deville/60 Special`,
            `Eldorado`,
            `Escalade 2wd`,
            `Fleetwood`,
            `Seville`,
            `T5 awd`,
            `XT5`,
            `XTS`,
          ],
        },

        {
          chrysler: [
            // Chrysler //
            `300`,
            `300 awd`,
            `Cirrus`,
            `Concorde`,
            `Crossfire`,
            `Crossfire Coupe`,
            `Fifth Avenue/Imperial`,
            `Laser`,
            `Lebaron`,
            `Lebaron Convertible`,
            `New Yorker`,
            `Pacifica`,
            `Pacifica Hybrid`,
            `Prowler`,
            `Sebring`,
            `Town and Country 2wd`,
          ],
        },

        {
          dodge: [
            // Dodge //
            `B150/b250 Wagon 2wd`,
            `B350 Wagon 2wd`,
            `Challenger`,
            `Charger`,
            `D100/D150 Pickup 2wd`,
            `Dynasty`,
            `Dakota Pickup 2wd`,
            `Dakota Pickup 4wd`,
            `Durango rwd`,
            `Durango awd`,
            `Durango 4wd`,
            `Grand Caravan`,
            `Intrepid`,
            `Journey`,
            `Journey awd`,
            `Ram 50 Pickup 2wd`,
            `Nitro 4wd`,
            `Ram 1500 Pickup 4wd`,
            `Spirit`,
          ],
        },

        {
          ford: [
            // Ford //
            `Explorer 2wd FFV`,
            `Explorer fwd`,
            `Explorer awd`,
            `Escape awd`,
            `Escape fwd`,
            `Expedition 2wd`,
            `Expedition 4wd`,
            `F150 Pickup 4wd`,
            `Fusion fwd`,
            `Fusion awd`,
            `Fiesta fwd`,
            `Flex fwd`,
            `Flex awd`,
            `Mustang`,
            `Ranger 4wd`,
            `Taurus awd`,
            `Taurus fws`,
          ],
        },

        {
          gmc: [
            // GMC //
            `Acadia fwd`,
            `Jimmy 4wd`,
            `Safari awd`,
            `Sierra 1500 4wd`,
            `Sierra C15 2wd`,
            `Sierra C15 4wd`,
            `Suburban 1500 4wd`,
            `Terrain fwd`,
            `Terrain awd`,
            `Yukon 1500 4wd`,
            `Yukon C1500 2wd`,
          ],
        },

        {
          honda: [
            // Honda //
            `Accord`,
            `Civic`,
            `CR-V 2wd`,
            `CR-V 4wd`,
            `CR-Z`,
            `Fit`,
            `HR-V 2wd`,
            `HR-V 4wd`,
            `Odyssey`,
            `Pilot 2wd`,
            `Pilot 4wd`,
          ],
        },

        {
          hyundai: [
            // Hyundai //
            `Accent`,
            `Azera`,
            `Elantra`,
            `Equus`,
            `Santa Fe fwd`,
            `Sonata`,
            `Tucson fwd`,
            `Tucson awd`,
            `Veloster`,
          ],
        },

        {
          infiniti: [
            // Infiniti //
            `Q50`,
            `Q70`,
            `QX50`,
            `QX50 awd`,
            `QX60 awd`,
            `QX70 awd`,
            `QX70 rwd`,
            `QX80 2wd`,
            `QX80 4wd`,
          ],
        },

        {
          jeep: [
            // Jeep //
            `Cherokee fwd`,
            `Cherokee 4wd`,
            `Compass 4wd`,
            `Compass fwd`,
            `Gladiator Pickup 4wd`,
            `Grand Cherokee 2wd`,
            `Grand Cherokee 4wd`,
            `Renegade 2wd`,
            `Renegade 4wd`,
            `Wrangler 4wd`,
          ],
        },

        {
          kia: [
            // KIA //
            `Cadenza`,
            `Forte`,
            `K5`,
            `Rio`,
            `Sedona`,
            `Seltos fwd`,
            `Seltos awd`,
            `Sorento awd`,
            `Sorento fwd`,
            `Soul`,
            `Sportage fwd`,
            `Sportage awd`,
            `Stinger awd`,
            `Stinger rwd`,
            `Telluride fwd`,
            `Telluride awd`,
          ],
        },

        {
          lexus: [
            // Lexus //
            `CT 200h`,
            `ES 300h`,
            `ES 350`,
            `GS 200t`,
            `GX 460`,
            `IS 200t`,
            `IS 300 awd`,
            `IS 350`,
            `IS 460 awd`,
            `LX 570`,
            `NX 300h`,
            `NX 200t`,
            `RX 450h`,
            `RX 350`,
            `RC 200t`,
          ],
        },

        {
          mazda: [
            // Mazda //
            `2`,
            `3 4-door`,
            `3 5-door`,
            `6`,
            `CX-3 2wd`,
            `CX-30 4wd`,
            `CX-5 2wd`,
            `CX-5 4wd`,
            `CX-9 2wd`,
            `CX-9 4wd`,
            `MX-5`,
          ],
        },

        {
          nissan: [
            // Nissan //
            `370Z`,
            `370Z Roadster`,
            `Altima awd`,
            `Armada 4wd`,
            `Frontier 2wd`,
            `Frontier 4wd`,
            `GT-R`,
            `Kicks`,
            `Murano awd`,
            `Murano fwd`,
            `Pathfinder 2wd`,
            `Pathfinder 4wd`,
            `Rogue awd`,
            `Rogue fwd`,
            `Sentra`,
            `Sentra Nismo`,
            `Titan 2wd`,
            `Titan 4wd`,
            `Versa`,
          ],
        },

        {
          ram: [
            // RAM //
            `1500 2wd`,
            `1500 4wd`,
            `1500 classic 2wd`,
            `1500 classic 4wd`,
            `1500 HFE 2wd`,
            `1500 TRX 4wd`,
            `Promaster City`,
          ],
        },

        {
          subaru: [
            // Subaru //
            `Ascent`,
            `WRX`,
            `Crosstrek awd`,
            `Impreza 4-door`,
            `Impreza 5-door`,
            `Legacy awd`,
            `Forester awd`,
            `Outback awd`,
            `BRZ`,
          ],
        },

        {
          toyota: [
            // Toyota //
            `4Runner 4wd`,
            `Avalon`,
            `C-HR`,
            `Camry`,
            `Corolla`,
            `GR Supra`,
            `Highlander`,
            `Prius`,
            `Prius C`,
            `RAV4`,
            `Sequoia 2wd`,
            `Sequoia 4wd`,
            `Tacoma 4wd`,
            `Tundra 2wd`,
            `Tundra 4wd`,
            `Venza awd`,
            `Yaris`,
          ],
        },

        {
          volkswagen: [
            // Volkswagen //
            `Arteron`,
            `Atlas`,
            `Beetle`,
            `e-Golf`,
            `Golf`,
            `GTI`,
            `Jetta`,
            `Jetta GLI`,
            `Passat`,
            `Tiguan`,
          ],
        },
      ],

      filteredCarModel: ``,
      makeAutoComplete: false,
      modelAutoComplete: false,
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
      console.log(this.make);
      this.makeAutoComplete = false;
    },
    getModel() {
      // let selectedMake = `${this.make}`;
      let modelArray = this.make;
      this.filteredCarModel = this.carModel[1].audi;
      return this.filteredCarModel;
    },
    setModel(model) {
      this.model = model;
      this.modelAutoComplete = false;
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
                  `http://www.mapquestapi.com/directions/v2/route?key=VWtLJjUxEFuyRfoQSeoWjGBFJHVhossb&ambiguous=check&from=${this.userLocation}&to=${this.stopCoords}&to=${this.destinationCoords}&to${this.userLocation}`,
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
          this.totalCost = `$` + finalCost.toFixed(2);
          // if (this.selectTrip === `one way`) {
          //   this.totalCost = `$` + finalCost.toFixed(2);
          // } else if (this.selectTrip === `round trip`) {
          //   this.totalCost = `$` + finalCost.toFixed(2) * 2;
          // }
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

/* .current-selection {
  animation: currentSelection 1.5s linear infinite;
}

@keyframes currentSelection {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  0% {
    transform: scale(1);
  }
} */

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

.model-list {
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

.btn-new-trip {
  position: absolute;
  bottom: 3vh;
  right: 10vw;
  height: 6vh;
  width: 12vw;
  color: #333;
  background-color: #c8f9d0;
  z-index: 1;
}

.btn-total-cost {
  position: absolute;
  bottom: 3vh;
  right: 25vw;
  height: 6vh;
  width: 5rem;
  color: #333;
  background-color: #c8f9d0;
  z-index: 1;
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
