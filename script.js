"use strict";

const link = "https://foobar-eksamen.herokuapp.com/";

// components
// const header = document.querySelector(".comp1");
// const queue = document.querySelector(".comp2");
// const orders = document.querySelector(".comp3");
// const shift = document.querySelector(".comp4");
// const stockStatus = document.querySelector(".comp5");
// const bestSellers = document.querySelector(".comp6");
// const spotify = document.querySelector(".comp7");

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

  document.querySelector("#theme-select").addEventListener("change", themeSelect);
}

// loads data
function loadJSON(url, callback) {
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

  // refresh the time and date
  setDateAndTime();

  // send data to components
  showQueue(data.queue);
  showStockStatus(data.storage);
  showOrders(data.queue, data.serving);

  // set which bartender is serving each order
  setBartender(data.bartenders);

  // set the icon for each bartender
  setBartenderIcon();
}

// function that converts orders to the right format and returns converted order
function convertSingleOrder(order) {
  let oldOrder = order;
  let newOrder = {};
  oldOrder.forEach((beer) => {
    if (newOrder[beer]) {
      newOrder[beer]++;
    } else {
      newOrder[beer] = 1;
    }
  });
  return newOrder;
}

// gets data from getData and displays how many are in the queue
function showQueue(queueData) {
  // show queue number
  document.querySelector("#queue-number").textContent = queueData.length;
}

// gets data from getData and displays the orders
function showOrders(orderData, servingData) {
  //show orders data
  const template = document.querySelector(".order-template");
  let container = document.querySelector(".orders-container");

  // clear container
  container.innerHTML = "";

  // orders that are being served
  servingData.forEach((order) => {
    let klon = template.cloneNode(true).content;
    let randomNum = Math.floor(Math.random() * 10) + 1;
    klon.querySelector(".table-no").textContent = randomNum;
    klon.querySelector(".beers").innerHTML = "";
    klon.querySelector(".order-no").textContent = "Order " + order.id;
    klon.querySelector(".order-container").classList.add("serving-order");

    const newOrder = convertSingleOrder(order.order);
    const joined = Object.entries(newOrder).join("x");
    const splitOrder = joined.split("x");

    splitOrder.forEach((orderItem) => {
      const number = orderItem.substring(orderItem.indexOf(",") + 1);
      const beer = orderItem.substring(0, orderItem.indexOf(","));
      const order = number + "x " + beer;

      let beerInOrder = document.createElement("li");
      beerInOrder.textContent = order;
      klon.querySelector(".beers").appendChild(beerInOrder);
    });

    container.appendChild(klon);
  });

  // orders in the queue
  orderData.forEach((order) => {
    let klon = template.cloneNode(true).content;
    klon.querySelector(".beers").innerHTML = "";
    klon.querySelector(".order-no").textContent = "Order " + order.id;
    let randomNum = Math.floor(Math.random() * 10) + 1;
    klon.querySelector(".table-no").textContent = randomNum;

    const newOrder = convertSingleOrder(order.order);
    const joined = Object.entries(newOrder).join("x");
    const splitOrder = joined.split("x");

    splitOrder.forEach((orderItem) => {
      const number = orderItem.substring(orderItem.indexOf(",") + 1);
      const beer = orderItem.substring(0, orderItem.indexOf(","));
      const order = number + "x " + beer;

      let beerInOrder = document.createElement("li");
      beerInOrder.textContent = order;
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

function setBartender(bartenders) {
  console.log("setbartender");

  // gets all order containers
  const orderContainers = document.querySelectorAll(".order-container");

  orderContainers.forEach((container) => {
    // checks if the order is being served
    if (container.classList.contains("serving-order")) {
      // gets the order number from the html
      const orderNo = container.querySelector(".order-no").textContent;

      // get the number at the back of the string
      const orderNumber = orderNo.substring(6);

      bartenders.forEach((bartender) => {
        // get what order number each bartender is serving from the bartender data
        const servingOrderNo = bartender.servingCustomer;

        // checks if the order number from the html and the order number from the bartenders data match
        // sets the correct class with what bartender has that order
        if (orderNumber == servingOrderNo) {
          if (bartender.name == "Peter") {
            container.classList.add("peter");
          } else if (bartender.name == "Jonas") {
            container.classList.add("jonas");
          } else if (bartender.name == "Dannie") {
            container.classList.add("dannie");
          }
        }
      });
    }
  });
}

function setBartenderIcon() {
  const orderContainers = document.querySelectorAll(".order-container");

  orderContainers.forEach((order) => {
    const icon = document.createElement("img");
    icon.classList.add("bartender-icon");

    // finde sourcen fra DOM fordi parcel laver filnavne om
    const dSource = document.querySelector(".d-bartender-icon").getAttribute("src");
    const pSource = document.querySelector(".p-bartender-icon").getAttribute("src");
    const jSource = document.querySelector(".j-bartender-icon").getAttribute("src");

    if (order.classList.contains("peter")) {
      // add peter icon
      icon.src = pSource;
    } else if (order.classList.contains("jonas")) {
      // add jonas icon
      icon.src = jSource;
    } else if (order.classList.contains("dannie")) {
      // add dannie icon
      icon.src = dSource;
    }
    order.appendChild(icon);
  });
}

function themeSelect() {
  console.log("theme select", this.value);
  if (this.value === "80s") {
    document.documentElement.className = "theme-80s";
  } else if (this.value === "vortex") {
    document.documentElement.className = "theme-vortex";
  } else if (this.value === "pastel") {
    document.documentElement.className = "theme-pastel";
  }
}

function shiftFocus() {
  console.log("shiftfocus");
  document.querySelectorAll(".shift-item").forEach((item) => {
    item.classList.remove("selected");
  });

  this.classList.add("selected");
}

function setDateAndTime() {
  let currentTime = getTime();
  let currentDate = getDate();
  document.querySelector(".time").textContent = currentTime;
  document.querySelector(".date").textContent = currentDate;
}

function getDate() {
  let date = new Date();
  let currentDate = date.getDate();
  let month = date.getMonth();
  let currentMonth = month + 1;
  let year = date.getFullYear();
  return currentDate + "/" + currentMonth + "/" + year;
}

function getTime() {
  let date = new Date();
  let minutes = date.getMinutes();
  let hours = date.getHours();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let currentTime = hours + ":" + minutes;
  return currentTime;
}
