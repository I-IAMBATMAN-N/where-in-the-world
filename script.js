"use strict";

const form = document.querySelector(".form");
const input = document.querySelector(".input");
const searchBtn = document.querySelector(".btn--input");
const countries = document.querySelector("#countries");

const section = document.querySelector(".section");

const countrySection = document.querySelector(".country-section");
console.log(countrySection);

let finalData;

function getAll() {
  fetch(`https://restcountries.com/v3.1/all`)
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      const data = responseData;

      // console.clear();
      console.log(data);

      displayRelevant(data);
      finalData = data;
      return data;
    })
    .catch((err) => {
      console.log("--------------------------------------", err);
    });
}

window.addEventListener("load", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  getAll();
});

function displayRelevant(object) {
  let element = ``;
  object.forEach((item) => {
    // console.log(element);
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

        displayRelevant(data);
        finalData = data;
        // return data;
      })
      .catch((err) => {
        console.log("--------------------------------------", err);
      });
  } else return;
}

countries.addEventListener("change", function (e) {
  getByRegion(
    e.target.value.search("Filter") > -1 ? undefined : e.target.value
  );
  // console.log(e.target.value);
});

function findCountry(inputValue) {
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
    displayRelevant(tempData);
  }
}

form.addEventListener("submit", function () {
  console.log(input.value);
  findCountry(input.value);
});

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
          displayFullCountry(data);

          // return data;
        })
        .catch((err) => {
          console.log("--------------------------------------", err);
        });
    });
  });
}

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

function displayFullCountry(country) {
  //
  let nativeName;
  if (country.name.nativeName) {
    console.log(country.name.nativeName);

    console.log("laguages", country.languages);
    console.log("neighbours", country.borders);

    const { ...nativeNames } = country.name.nativeName;
    const objKeys = Object.keys(country.name.nativeName);

    nativeName = nativeNames[objKeys[0]].official;
  } else {
    console.log("NO NATIVE NAME");
  }

  let currString = "";
  let langString = "";

  const currencyKeys = Object.keys(country.currencies);
  const languagesKeys = Object.keys(country.languages);

  console.log(currencyKeys.length);
  console.log(languagesKeys.length);

  currencyKeys.forEach((key, index) => {
    currString += key;
    if (index < currencyKeys.length - 1) {
      currString += ", ";
    }
  });
  languagesKeys.forEach((key, index) => {
    langString += key;
    if (index < languagesKeys.length - 1) {
      langString += ", ";
    }
  });

  console.log("currencies", country.currencies);
  console.log("languages", languagesKeys);

  console.log(country.capital[0]);

  function fillNeighbors(neighbours) {
    if (neighbours) {
      let element = "";

      function getCountryName(countryCode) {
        fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
            const [data] = responseData;

            console.log(data);

            return data;
          })
          .catch((err) => {
            console.log("--------------------------------------", err);
          });
      }
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
  let element = `
    <article class="country-full">
      <img src="${country.flags.svg}" alt="${
    country.flags.alt || country.name.official
  } flag" width="500px" />
      <section>
        <h3 class="name">${country.name.official}</h3>
        <h5 class="data">Native Name: <span>${nativeName}</span></h5>
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
        <h5 class="data">Currencies: <span>${currencyKeys}</span></h5>
        <h5 class="data">Languages: <span>${langString}</span></h5>
        <br />
        <h5 class="data">Neighbours: </h5>
        <ul class="list">
            ${fillNeighbors(country.borders)}
        </ul>
      </section>    
    </article>
  `;

  // console.log(element);

  section.innerHTML = "";
  section.style.display = "none";

  const inputContainers = form.querySelectorAll(".input-container");

  console.log(inputContainers);
  inputContainers.forEach((container) => {
    container.classList.toggle("active");
  });

  form.innerHTML += `
    <button> back </button>
  `;
  form.style.display = "none";

  countrySection.innerHTML += element;
}
