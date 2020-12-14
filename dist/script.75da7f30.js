// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"script.js":[function(require,module,exports) {
"use strict";

var link = "https://foobar-eksamen.herokuapp.com/"; // components

var header = document.querySelector(".comp1");
var queue = document.querySelector(".comp2");
var orders = document.querySelector(".comp3");
var shift = document.querySelector(".comp4");
var stockStatus = document.querySelector(".comp5");
var bestSellers = document.querySelector(".comp6");
var spotify = document.querySelector(".comp7");
window.addEventListener("load", start);

function start() {
  console.log("start"); // show data at load

  loadJSON(link, getData); // show data every 10 seconds

  setInterval(function () {
    loadJSON(link, getData);
  }, 10000); // add event listener to shift items

  document.querySelectorAll(".shift-item").forEach(function (item) {
    item.addEventListener("click", shiftFocus);
  });
} // loads data


function loadJSON(url, callback) {
  console.log("Update data");
  fetch(url).then(function (response) {
    return response.json();
  }).then(function (jsonData) {
    callback(jsonData);
  });
} // delegateing function that sends data to other functions


function getData(data) {
  console.log("data is loaded");
  console.log(data); // send data to components

  showQueue(data.queue);
  showOrders(data.queue, data.serving);
  showStockStatus(data.storage); // test

  console.log(data.queue); // orders that have been converted to the right format

  var convertedOrders = convertOrder(data.queue);
  console.log("CONVERTED", convertedOrders);
} // function that converts orders to the right format and returns array


function convertOrder(data) {
  var convertedOrders = [];
  data.forEach(function (order) {
    var oldOrder = order.order;
    var newOrder = {};
    oldOrder.forEach(function (beer) {
      if (newOrder[beer]) {
        newOrder[beer]++;
      } else {
        newOrder[beer] = 1;
      }
    });
    convertedOrders.push(newOrder);
  });
  return convertedOrders;
} // gets data from getData and displays how many are in the queue


function showQueue(queueData) {
  // show queue number
  document.querySelector(".queue-number").textContent = queueData.length;
} // gets data from getData and displays the orders


function showOrders(orderData, servingData) {
  //show orders data
  var template = document.querySelector(".order-template");
  var container = document.querySelector(".orders-container"); // clear container

  container.innerHTML = ""; // orders that are being served

  servingData.forEach(function (order) {
    var klon = template.cloneNode(true).content;
    var randomNum = Math.floor(Math.random() * 10) + 1;
    klon.querySelector(".order-no").textContent = randomNum;
    klon.querySelector(".beers").innerHTML = ""; //klon.querySelector(".order-container").classList.add("fadeinout");

    klon.querySelector(".order-no").textContent = "Order " + order.id;
    klon.querySelector(".order-container").classList.add("serving-order");
    order.order.forEach(function (beer) {
      var beerInOrder = document.createElement("li");
      beerInOrder.textContent = beer;
      klon.querySelector(".beers").appendChild(beerInOrder);
    });
    container.appendChild(klon);
  }); // orders in the queue

  orderData.forEach(function (order) {
    var klon = template.cloneNode(true).content;
    klon.querySelector(".beers").innerHTML = "";
    klon.querySelector(".order-no").textContent = "Order " + order.id; //klon.querySelector(".order-container").classList.add("fadeinout");

    order.order.forEach(function (beer) {
      var beerInOrder = document.createElement("li");
      beerInOrder.textContent = beer;
      klon.querySelector(".beers").appendChild(beerInOrder);
    });
    container.appendChild(klon);
  });
}

function showStockStatus(storageData) {
  // console.log(storageData);
  var template = document.querySelector(".storage-template");
  var container = document.querySelector(".storage-container"); // clear container

  container.innerHTML = ""; // orders in the queue

  storageData.forEach(function (item) {
    var klon = template.cloneNode(true).content;
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
  document.querySelectorAll(".shift-item").forEach(function (item) {
    item.classList.remove("selected");
  });
  this.classList.add("selected");
}
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50081" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map