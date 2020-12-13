"use strict";

const link = "https://foobar-eksamen.herokuapp.com/";

// components
const header = document.querySelector(".comp1");
const queue = document.querySelector(".comp2");
const orders = document.querySelector(".comp3");
const shift = document.querySelector(".comp4");
const stockStatus = document.querySelector(".comp5");
const bestSellers = document.querySelector(".comp6");
const spotify = document.querySelector(".comp7");

window.addEventListener("load", start);

function start() {
  console.log("start");

  // show data at load
  loadJSON(link, getData);

  // show data every 10 seconds
  setInterval(() => {
    loadJSON(link, getData);
  }, 10000);
}

// loads data
function loadJSON(url, callback) {
  console.log("Update data");
  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      callback(jsonData);
    });
}

function getData(data) {
  console.log("data is loaded");
  console.log(data);

  // send data to components
  showQueue(data.queue);

  showOrders(data.queue, data.serving);

  showStockStatus(data.storage);
}

function showQueue(queueData) {
  console.log(queueData);

  // show queue number CHANGE TO TEXTCONTENT LATER
  queue.innerHTML = queueData.length;
}

function showOrders(orderData, servingData) {
  //show orders data
  const template = document.querySelector(".order-template");
  let container = document.querySelector(".orders-container");

  // clear container
  container.innerHTML = "";

  // orders that are being served
  servingData.forEach((order) => {
    let klon = template.cloneNode(true).content;
    klon.querySelector(".beers").innerHTML = "";
    klon.querySelector(".order-no").textContent = order.id;
    klon.querySelector(".order-no").style.color = "red";

    order.order.forEach((beer) => {
      let beerInOrder = document.createElement("li");
      beerInOrder.textContent = beer;
      klon.querySelector(".beers").appendChild(beerInOrder);
    });
    container.appendChild(klon);
  });

  // orders in the queue
  orderData.forEach((order) => {
    let klon = template.cloneNode(true).content;
    klon.querySelector(".beers").innerHTML = "";
    klon.querySelector(".order-no").textContent = order.id;

    order.order.forEach((beer) => {
      console.log("beers" + beer);
      let beerInOrder = document.createElement("li");
      beerInOrder.textContent = beer;
      klon.querySelector(".beers").appendChild(beerInOrder);
    });
    container.appendChild(klon);
  });
}

function showStockStatus(storageData) {
  console.log(storageData);

  const template = document.querySelector(".storage-template");
  let container = document.querySelector(".storage-container");

  // clear container
  container.innerHTML = "";

  // orders in the queue
  storageData.forEach((item) => {
    let klon = template.cloneNode(true).content;
    klon.querySelector(".storage-name").textContent = item.name;

    // klon.querySelector(".inner").textContent = item.amount + "0%";
    // klon.querySelector(".outer").textContent = item.amount + "0%";
    klon.querySelector(".storage-meter").style.width = item.amount + "0%";

    if (item.amount === 1) {
      klon.querySelector(".storage-meter").textContent = item.amount + " keg";
    } else {
      klon.querySelector(".storage-meter").textContent = item.amount + " kegs";
    }

    container.appendChild(klon);
  });
}
