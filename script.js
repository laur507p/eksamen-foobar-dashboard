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
  console.log("data is shown");
  console.log(data);

  // send data to components
  showQueue(data.queue);

  showOrders(data.queue);

  showStockStatus(data.storage);
}

function showQueue(queueData) {
  console.log(queueData);

  // show queue number CHANGE TO TEXTCONTENT LATER
  queue.innerHTML = queueData.length;
}

function showOrders(orderData) {
  //show orders data
}

function showStockStatus(storageData) {}
