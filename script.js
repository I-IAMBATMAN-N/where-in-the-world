"use strict";

const fetchURLs = {
  all: "https://restcountries.com/v3.1/all",
  byName: "https://restcountries.com/v3.1/name/",
  byCode: "https://restcountries.com/v3.1/alpha/",
  byRegion: "https://restcountries.com/v3.1/region/",
};

// Search form DOM data
const form = document.querySelector(".form");
const input = document.querySelector(".input");
const searchBtn = document.querySelector(".btn--input");
const selectRegion = document.querySelector("#countries");
// const formInnerHTML = form.innerHTML;

// sections DOM data
const section = document.querySelector(".section");
const countrySection = document.querySelector(".country-section");
const containers = [section, countrySection];

const btnFormBack = document.querySelector(".btn--back");
const inputContainers = document.querySelectorAll(".input-container");
const formElements = [btnFormBack, ...inputContainers];

//
const btnMode = document.querySelector(".btn--mode");
const btnModeSpans = document.querySelectorAll(".btn--mode span");
const body = document.querySelector("body");

let dataAll = {};
let mainData = {};

const countriesAndCodes = [];

function displayRelevantFormElement() {
  formElements.forEach((element) => {
    element.classList.toggle("active");
  });
}
function displayRelevantSection() {
  containers.forEach((container) => {
    container.classList.toggle("active");
  });
}
function displayCountries(countries) {
  let element = ``;
  countries.forEach((country) => {
    element += `
    <article class="country">
    <img src="${country.flags.png}" alt="${country.flags.alt}" class="img"/>
      <section> 
      <h3 class="country-name">${country.name.official}</h3>
        <h5 class="data">Population: <span>${(
          +country.population / 1000000
        ).toFixed(1)} mil.</span></h5>
        <h5 class="data">Region: <span>${country.region}</span></h5>
        <h5 class="data">Capital: <span>${
          country.capital || "no capital"
        }</span></h5>
      </section>
    </article>
  `;
  });
  section.innerHTML = ``;
  section.innerHTML += element;
  countriesEventListenner();
}

// Design functions
// mode button event listenner
// changes theme by toggle .active class on body element
btnMode.addEventListener("click", () => {
  btnModeSpans.forEach((span) => {
    span.classList.toggle("active");
  });
  body.classList.toggle("mode");
});
//
btnFormBack.addEventListener("click", () => {
  displayRelevantFormElement();
  displayRelevantSection();
});
//------------------------------------------------------------------ ++++++++++ ------------------------------------------------------------------
//------------------------------------------------------------------ CALLSTACK -------------------------------------------------------------------
//------------------------------------------------------------------ ++++++++++ ------------------------------------------------------------------

//
// ---------- onLoad functions ----------
//
// display all countires on window load
// using async getAll() for fetching datas
async function getAll() {
  try {
    const res = await fetch(fetchURLs.all);
    const data = res.json();
    //
    return data;
  } catch (err) {
    console.error(err);
  }
}
window.addEventListener("load", () => {
  //
  getAll().then((data) => {
    console.log("NOVY", data);
    displayCountries(data);

    //
    // filling countriesAndCodes array with new created object containing coutryCode and countryName only
    // array used in future for defining country neighbours name from country code
    data.forEach((data) => {
      countriesAndCodes.push({
        countryCode: data.cca2,
        countryName: data.name.common,
      });
    });

    //
    dataAll = data;

    //
    let neighboursNames = [];

    countriesAndCodes.forEach((countryAndCode) => {
      data.forEach((dataItem) => {});
    });

    //
    mainData = data;
  });
});
//------------------------------------------------------------------ ++++++++++ ------------------------------------------------------------------

//
// ---------- Search functions ----------
//
// display all countires on region select
// using async getSelected() for fetching datas
async function getSelected(region) {
  try {
    const res = await fetch(fetchURLs.byRegion + region);
    const data = res.json();
    //
    return data;
  } catch (err) {
    console.error(err);
  }
}
function getSelected2(region) {
  const selectedData = [];
  dataAll.forEach((data) => {
    if (data.region.toLowerCase().search(region) > -1) {
      selectedData.push(data);
    }
  });

  mainData = selectedData;
  // console.log("selectedData", selectedData);
  displayCountries(selectedData);
}
selectRegion.addEventListener("change", function (e) {
  let region = e.target.value.toLowerCase();

  // getSelected(region).then((data) => {
  //   displayCountries(data);
  //   mainData = data;
  // });

  getSelected2(region);
});

//
// display all countires on form submit
// using async getByName() for fetching datas
async function getByName(name) {
  try {
    const res = await fetch(fetchURLs.byName + name);
    const data = res.json();
    //
    return data;
  } catch (err) {
    console.error(err);
  }
}
form.addEventListener("submit", function (e) {
  console.log("SUBMIIIIT AS FUCK");
  //
  e.preventDefault();
  let searchWord = String(input.value).toLowerCase();
  //
  function getSearched(word) {
    let searchedData = [];
    //
    mainData.forEach((data) => {
      if (
        data.name.official.toLowerCase().search(word) > -1 ||
        data.name.common.toLowerCase().search(word) > -1
      ) {
        searchedData.push(data);
      }
    });

    return searchedData;
  }
  //

  displayCountries(getSearched(searchWord));
});
//------------------------------------------------------------------ ++++++++++ ------------------------------------------------------------------

//
// Displays country in detail
function countriesEventListenner() {
  //
  const countriesSmall = document.querySelectorAll(".country");
  //
  countriesSmall.forEach((countrySmall) => {
    countrySmall.addEventListener("click", function (e) {
      //
      let name = e.target
        .closest(".country")
        .children[1].children[0].innerText.toLowerCase();
      console.log(name);

      //
      // display relevant elements
      // toggle section and form containers .active class state

      //
      getByName(name).then((resData) => {
        //
        const [data] = resData;
        //
        displayRelevantSection();
        displayRelevantFormElement();
        displayCountry(data);
      });
    });
  });

  function displayCountry(country) {
    //
    const countryCodes = country.borders || undefined;
    const neighboursArray = [];
    const neighboursNames = [];

    const currencies = Object.keys(country.currencies) || "none";
    const languages = Object.keys(country.languages) || "none";

    // ---------- Get Neighbours ----------
    async function getNeighbours(code) {
      try {
        const res = await fetch(fetchURLs.byCode + code);
        const data = res.json();
        //
        return data;
      } catch (err) {
        console.error(err);
      }
    }
    if (countryCodes) {
      countryCodes.forEach((code) => {
        getNeighbours(code).then((resData) => {
          const [data] = resData;
          neighboursArray.push(
            `<li class="list-item">
              <a href="#">${data.name.common}</a>
            </li>`
          );
        });
      });

      //
    }

    function displayNeighbours() {
      //
      let element = ``;
      //
      if (countryCodes) {
        countryCodes.forEach((code) => {
          mainData.forEach((data) => {
            if (
              data.cca2 === code ||
              data.cca3 === code ||
              data.cioc === code
            ) {
              element += `<li class="list-item">${data.name.common}</li>`;
              console.log(data.name.common);
            }
          });
        });
      } else {
        element = `<span>No Neighbours</span>`;
      }
      return element;
    }
    //
    // Full country element structure layout
    let element = `
    <article class="country-full">
      <img src="${country.flags.svg}" alt="${
      country.flags.alt || country.name.official
    } flag" width="500px" />
      <section>
        <h3 class="name">${country.name.official}</h3>
        <h5 class="data">Native Name: <span>${
          country.name.nativeName.common || "none"
        }</span></h5>
        <h5 class="data">
          Population: <span>${+(country.population / 1000000).toFixed(
            1
          )} mil.</span>
        </h5>
        <h5 class="data">Region: <span>${country.region}</span></h5>
        <h5 class="data">
          Sub Region: <span>${country.subRegion || "none"}</span>
        </h5>
        <h5 class="data">
          Capital: <span>${country.capital || "none"}</span>
        </h5>
        <br />
        <h5 class="data">Top Level Domain: <span>${country.tld}</span></h5>
        <h5 class="data">Currencies: <span>${currencies}</span></h5>
        <h5 class="data">Languages: <span>${languages}</span></h5>
        <br />
        <h5 class="data">Neighbours: </h5>
        <ul class="list">
            ${displayNeighbours()}
        </ul>
      </section>
    </article>
  `;
    countrySection.innerHTML = ``;
    countrySection.innerHTML += element;
    //
  }
}
