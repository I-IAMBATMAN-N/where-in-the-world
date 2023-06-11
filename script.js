"use strict";

// Prepare Functions
// const fetchURLs = {
//   all: "https://restcountries.com/v3.1/all",
//   byName: "https://restcountries.com/v3.1/name/",
// };

// function fetchData(url = fetchURLs.all) {
//   fetch(url)
//     .then((response) => {
//       return response.json();
//     })
//     .then((responseData) => {
//       const data = responseData;

//       // console.clear();
//       finalData = data;
//       return data;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

const form = document.querySelector(".form");
const input = document.querySelector(".input");
const searchBtn = document.querySelector(".btn--input");
const countries = document.querySelector("#countries");

const section = document.querySelector(".section");

const countrySection = document.querySelector(".country-section");
console.log(countrySection);

let finalData;

//
const btnMode = document.querySelector(".btn--mode");
const btnModeSpans = document.querySelectorAll(".btn--mode span");
const body = document.querySelector("body");

btnMode.addEventListener("click", function () {
  btnModeSpans.forEach((span) => {
    span.classList.toggle("active");
    console.log("Done");
  });
  body.classList.toggle("mode");
});

/* DEFAULT --------------------------------------------------- */
// onLoad
// displays all countries on window load
function displayAll() {
  fetch(`https://restcountries.com/v3.1/all`)
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      const data = responseData;

      // console.clear();
      console.log(data);

      displaySmall(data);
      finalData = data;
      return data;
    })
    .catch((err) => {
      console.log("--------------------------------------", err);
    });
}

// displays relevant countries acc. to passed object
function displaySmall(object) {
  function articleListenner(articles) {
    articles.forEach((article) => {
      article.addEventListener("click", (e) => {
        let text = e.target
          .closest(".country")
          .children[1].children[0].innerText.toLowerCase();

        //
        fetch(`https://restcountries.com/v3.1/name/${text}`)
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
            const [data] = responseData;

            console.log(data);
            displayLarge(data);

            // return data;
          })
          .catch((err) => {
            console.log("--------------------------------------", err);
          });
      });
    });
  }

  //
  let element = ``;
  object.forEach((item) => {
    //
    element += `
      <article class="country">
      <img src="${item.flags.png}" alt="${item.flags.alt}" class="img"/>
        <section> 
        <h3 class="country-name">${item.name.official}</h3>
          <h5 class="data">Population: <span>${(
            +item.population / 1000000
          ).toFixed(1)} mil.</span></h5>
          <h5 class="data">Region: <span>${item.region}</span></h5>
          <h5 class="data">Capital: <span>${
            item.capital || "no capital"
          }</span></h5>
        </section>
      </article>
    `;
  });
  section.innerHTML = ``;
  section.innerHTML += element;
  articleListenner(section.querySelectorAll(".country"));
}
//
// form functions
// - call function displaying searched country
form.addEventListener("submit", function () {
  displaySearchedCountry(input.value);
});
//
// onload calls function that displays all countries
window.addEventListener("load", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  displayAll();
});

//
// regions option element onchange event listenner
countries.addEventListener("change", function (e) {
  //
  function getByRegion(region) {
    if (region) {
      fetch(`https://restcountries.com/v3.1/region/${region}`)
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          const data = responseData;

          console.clear();
          console.log(data);

          displaySmall(data);
          finalData = data;
          // return data;
        })
        .catch((err) => {
          console.log("--------------------------------------", err);
        });
    } else return;
  }
  getByRegion(
    e.target.value.search("Filter") > -1 ? undefined : e.target.value
  );
});

function displaySearchedCountry(inputValue) {
  let tempData = [];
  if (!inputValue.search("Filter") > -1) {
    finalData.forEach((country) => {
      if (
        country.name.common.toLowerCase().search(inputValue.toLowerCase()) >
          -1 ||
        country.name.official.toLowerCase().search(inputValue.toLowerCase()) >
          -1
      ) {
        tempData.push(country);
      }
    });
    // console.log(finalData);
    displaySmall(tempData);
  }
}
function displayLarge(country) {
  //
  function fillNeighbors(neighbours) {
    function getCountryName(countryCode) {
      fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          const [data] = responseData;

          console.log("country name", data.name.common);

          return data.name.common;
        })
        .catch((err) => {
          console.log("--------------------------------------", err);
        });
    }
    if (neighbours) {
      let element = "";

      //

      neighbours.forEach((neighbour) => {
        console.log("neighbour-22", neighbour);
        element += `
        <li class="list-item">${neighbour}</li>
        `;
      });
      return element;
    } else
      return `
        <li class="list-item">No Neighbour</li>
        `;
  }
  //
  function getNativeName() {
    if (country.name.nativeName) {
      //
      const { ...nativeNames } = country.name.nativeName;
      const objKeys = Object.keys(country.name.nativeName);

      return nativeNames[objKeys[0]].official;
    } else {
      return "No Native Name";
    }
  }
  //
  function getCurrencies() {
    let string = "";
    const currencyKeys = Object.keys(country.currencies);
    currencyKeys.forEach((key, index) => {
      string += key;
      if (index < currencyKeys.length - 1) {
        string += ", ";
      }
    });
    return string;
  }
  //
  function getLanguages() {
    let string = "";
    const languagesKeys = Object.keys(country.languages);
    languagesKeys.forEach((key, index) => {
      string += key;
      if (index < languagesKeys.length - 1) {
        string += ", ";
      }
    });
    return string;
  }

  let element = `
    <article class="country-full">
      <img src="${country.flags.svg}" alt="${
    country.flags.alt || country.name.official
  } flag" width="500px" />
      <section>
        <h3 class="name">${country.name.official}</h3>
        <h5 class="data">Native Name: <span>${getNativeName()}</span></h5>
        <h5 class="data">
          Population: <span>${+(country.population / 1000000).toFixed(
            1
          )} mil.</span>
        </h5>
        <h5 class="data">Region: <span>${country.region}</span></h5>
        <h5 class="data">
          Sub Region: <span>${country.subRegion || "no subregion"}</span>
        </h5>
        <h5 class="data">
          Capital: <span>${country.capital[0] || "no capital"}</span>
        </h5>
        <br />
        <h5 class="data">Top Level Domain: <span>${country.tld}</span></h5>
        <h5 class="data">Currencies: <span>${getCurrencies()}</span></h5>
        <h5 class="data">Languages: <span>${getLanguages()}</span></h5>
        <br />
        <h5 class="data">Neighbours: </h5>
        <ul class="list">
            ${fillNeighbors(country.borders)}
        </ul>
      </section>    
    </article>
  `;

  const inputContainers = form.querySelectorAll(".input-container");
  //
  inputContainers.forEach((container) => {
    container.classList.toggle("active");
  });
  //
  form.innerHTML += `
    <button class="btn--back"> back </button>
  `;
  //
  section.style.display = "none";
  countrySection.innerHTML += element;
}
