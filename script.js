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

  // add event listener to shift items
  document.querySelectorAll(".shift-item").forEach((item) => {
    item.addEventListener("click", shiftFocus);
  });
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

// delegateing function that sends data to other functions
function getData(data) {
  console.log("data is loaded");
  console.log(data);

  // send data to components
  showQueue(data.queue);

  showStockStatus(data.storage);

  // test
  console.log(data.queue);

  // orders that have been converted to the right format
  const convertedOrders = convertOrder(data.queue);
  console.log("CONVERTED", convertedOrders);

  showOrders(data.queue, data.serving, convertedOrders);
}

// function that converts orders to the right format and returns array
function convertOrder(data) {
  let convertedOrders = [];

  data.forEach((order) => {
    let oldOrder = order.order;
    let newOrder = {};
    oldOrder.forEach((beer) => {
      if (newOrder[beer]) {
        newOrder[beer]++;
      } else {
        newOrder[beer] = 1;
      }
    });
    convertedOrders.push(newOrder);
  });
  return convertedOrders;
}

// gets data from getData and displays how many are in the queue
function showQueue(queueData) {
  // show queue number
  document.querySelector(".queue-number").textContent = queueData.length;
}

// gets data from getData and displays the orders
function showOrders(orderData, servingData, convertedOrders) {
  //show orders data
  const template = document.querySelector(".order-template");
  let container = document.querySelector(".orders-container");
  let stringOrders = JSON.stringify(convertedOrders);
  console.log(stringOrders);
  // clear container
  container.innerHTML = "";

  // orders that are being served
  servingData.forEach((order) => {
    let klon = template.cloneNode(true).content;
    let randomNum = Math.floor(Math.random() * 10) + 1;
    klon.querySelector(".order-no").textContent = randomNum;
    klon.querySelector(".beers").innerHTML = "";
    klon.querySelector(".order-no").textContent = "Order " + order.id;
    klon.querySelector(".order-container").classList.add("serving-order");

    convertedOrders.forEach((beer) => {
      let stringOrders = JSON.stringify(beer);
      let beerInOrder = document.createElement("li");
      beerInOrder.textContent = stringOrders;
      klon.querySelector(".beers").appendChild(beerInOrder);
    });
    container.appendChild(klon);
  });

  // orders in the queue
  orderData.forEach((order) => {
    let klon = template.cloneNode(true).content;
    klon.querySelector(".beers").innerHTML = "";
    klon.querySelector(".order-no").textContent = "Order " + order.id;
    //klon.querySelector(".order-container").classList.add("fadeinout");

    order.order.forEach((beer) => {
      let beerInOrder = document.createElement("li");
      beerInOrder.textContent = beer;
      klon.querySelector(".beers").appendChild(beerInOrder);
    });
    container.appendChild(klon);
  });
}

function showStockStatus(storageData) {
  // console.log(storageData);

  const template = document.querySelector(".storage-template");
  let container = document.querySelector(".storage-container");

  // clear container
  container.innerHTML = "";

  // orders in the queue
  storageData.forEach((item) => {
    let klon = template.cloneNode(true).content;
    klon.querySelector(".storage-name").textContent = item.name;

    klon.querySelector(".storage-meter").style.width = item.amount + "0%";

    if (item.amount === 1) {
      klon.querySelector(".storage-meter").textContent = item.amount;
    } else {
      klon.querySelector(".storage-meter").textContent = item.amount + " kegs";
    }

    container.appendChild(klon);
  });
}

function shiftFocus() {
  console.log("shiftfocus");
  document.querySelectorAll(".shift-item").forEach((item) => {
    item.classList.remove("selected");
  });

  this.classList.add("selected");
}
