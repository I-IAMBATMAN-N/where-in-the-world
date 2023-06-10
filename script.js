"use strict";

const form = document.querySelector(".form");
const input = document.querySelector(".input");
const searchBtn = document.querySelector(".btn--input");
const countries = document.querySelector("#countries");

const section = document.querySelector(".section");

let finalData;

function getAll() {
  fetch(`https://restcountries.com/v3.1/all`)
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      const data = responseData;

      console.clear();
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
          <h5 class="data">Population: <span>${item.population} mil.</span></h5>
          <h5 class="data">Region: <span>${item.region}</span></h5>
          <h5 class="data">Capital: <span>${item.capital}</span></h5>
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
        country.name.common.toLowerCase().search(inputValue) > -1 ||
        country.name.official.toLowerCase().search(inputValue) > -1
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
      let text = e.target.closest(".country").children[1].innerText;

      // return text;
      //
      fetch(`https://restcountries.com/v3.1/name/${text}`)
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          const [data] = responseData;

          console.log(data);

          // return data;
        })
        .catch((err) => {
          console.log("--------------------------------------", err);
        });
    });
  });
}
