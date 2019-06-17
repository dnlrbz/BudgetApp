/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AppController_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


new _AppController_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
    element: document.getElementById('app')
})

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AppController; });
/* harmony import */ var _Transactions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);




class AppController {
    constructor({element}) {
        this._el = element;
        let self = this;
        this._data = {
            transactionsArray: [],
            total: 0,
            income: 0,
            expenses: 0,
            expensesPercentage: 0,
        };
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                self._user = user;
                self._renderAfterLogin();
                console.log('already logged in');

                self._trans = new _Transactions_js__WEBPACK_IMPORTED_MODULE_0__["default"](document.getElementById('transactions_table'), self._user.email, self._updateData.bind(self));
                self._updateData();
            } else {
                self._renderBeforeLogin();
                console.log('not logged in');
            }

        });

        this._addEventListeners();
    }

    /**
     * Updates Data object and counts all incomes, expenses and total
     * @param transaction
     * @param typeOfAction Specifies type 'add' or 'delete'
     * @private
     */
    _updateData(transaction, typeOfAction) {
        //updating total
        if(typeOfAction === 'add') {
            this._data.transactionsArray.push(transaction);
        }
        if( typeOfAction === 'remove') {
            this._data.transactionsArray = this._data.transactionsArray.filter(item => item.id!==transaction.id);
        }

        let total = Number((this._data.transactionsArray.reduce(function (accumulator, currentItem) {
            return currentItem.type === 'inc' ? accumulator + Number(currentItem.amount) : accumulator - Number(currentItem.amount);
        }, 0))) ;
        this._data.total = total.toFixed(2);

        let income = Number(this._data.transactionsArray.reduce(function (accumulator, currentItem) {
            if (currentItem.type ==='inc') {
                return accumulator + Number(currentItem.amount);
            }
            return accumulator;
        }, 0));
        this._data.income = income.toFixed(2);



        let expenses = Number(this._data.transactionsArray.reduce(function (accumulator, currentItem) {
            if (currentItem.type ==='exp') {
                return accumulator + Number(currentItem.amount);
            }
            return accumulator;
        }, 0));
        this._data.expenses = expenses.toFixed(2);


        let expPerc = Number(+this._data.expenses/ this._data.income) * 100;
        this._data.expensesPercentage = isFinite(expPerc) ? expPerc.toFixed(1) : 100;

        this._updateBudgetUI();

    }

    /**
     * Updates HTML of Budget
     * @private
     */
    _updateBudgetUI() {
        //console.log('new total: ' +this._data.total);
        document.querySelector('.budget__value').innerHTML = this._data.total + '€';
        document.querySelector('.budget__income--value').innerHTML = this._data.income + '€';
        document.querySelector('.budget__expenses--value').innerHTML = this._data.expenses + '€';
        document.querySelector('.budget__expenses--percentage').innerHTML = this._data.expensesPercentage + '%';
    }

    /**
     * Added all event listeners
     * @private
     */
    _addEventListeners() {

        document.addEventListener('DOMContentLoaded', event => {
            const app = firebase.app();
            //console.log('dom content loaded');
        });

        this._el.addEventListener('click', event => {
            if (event.target.id === 'login-btn' || event.target.parentElement.id === 'login-btn') {
                this._googleLogin();
            }
            if (event.target.id === 'logout-btn') {
                this._logout();
            }

            if (event.target.id === 'add__btn' || event.target.parentElement.id === 'add__btn') {
                //console.log('add button fired');

                let type = document.querySelector('.add__type').value;
                let description = document.querySelector('.add__description');
                let value = document.querySelector('.add__value');
                if (description.value==='' || value.value===0 || value.value==='') return;

                console.log(type, description.value, value.value, this._user.email);
                //console.log('random id: ' + Math.round(Math.random()*100000000).toString());
                let userMail = this._user.email;
                let date = new Date();
                let time = date.getDate() + '.' + Number(date.getUTCMonth()+1);
                let id = Math.round(Math.random()*100000000).toString();

                this._updateData({
                    id: id,
                        description: description.value,
                    amount: value.value,
                    type: type,
                    userMail: userMail,
                    time: time
                }, 'add');

                this._trans._addTransactionToDB.call(this._trans, id, description.value, value.value, type, userMail, time);

                description.value = '';
                value.value = '';

            }

            if (event.target.id === 'show_expenses' || event.target.id === 'show_income') {
                if (event.target.id === 'show_expenses') {
                    document.querySelector('.expenses').classList.remove('invisible');
                    document.querySelector('.income').classList.add('invisible');
                } else {
                    document.querySelector('.expenses').classList.add('invisible');
                    document.querySelector('.income').classList.remove('invisible');
                }


            }

            if (event.target.classList.contains('deleteb')) {

                let itemToDelete = event.target.closest('.item-a');
                let idToDelete = itemToDelete.dataset.id;
                this._updateData({
                    id: idToDelete,
                }, 'remove');
                this._trans._deleteTransaction(idToDelete, itemToDelete);
            }

            //console.log(event.target);

        });

    }

    /**
     * Log out from account
     * @private
     */
    _logout() {
        const self = this;
        firebase.auth().signOut().then(function() {
            console.log('Logged out');
            self._renderBeforeLogin();
        }).catch(function(error) {
            console.log('Failed to log out');
        });
    }

    /**
     * Login with google account through Firebase
     * @private
     */
    _googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {
            this._user = result.user;
            //console.log('logged in ' + this._user.displayName);
            this._renderAfterLogin();

        })
            .catch(err => console.log(err));
    }

    /**
     * Render a Page before Logging in
     * @private
     */
    _renderBeforeLogin() {
        this._el.innerHTML = `
        
        <div id="carouselExampleIndicators" class="carousel slide text-center" data-ride="carousel">
             
              <div class="carousel-inner">
                <div class="carousel-item active item min-vh-100">
                  <img src="images/iphone.jpg" class="d-block min-vh-100 zoom" alt="...">
                </div>
                <div class="carousel-item item min-vh-100">
                  <img src="images/mac.jpg" class="d-block min-vh-100 zoom" alt="...">
                </div>
              </div>
              <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </a>
              
              <div class="main-text hidden-xs hidden-sm text-center">
                    <p class="h1 main-text-item">Secure and free personal budget tracker</span></p>
                    
                    <button class="btn btn-primary btn-lg google text-center" id="login-btn">
                    <p class="button-text">Log in with Google</p>
                    </button>
              </div>
        </div>
        `

    }

    /**
     * Render a Page after user has logged in
     * @private
     */
    _renderAfterLogin() {
        this._el.innerHTML = `
            <div id="transactions-container">
            
            </div> 
            
            
            <div class="top">
            <div class="control_buttons">
                <button class="btn-primary" id="logout-btn">Logout</button>
            </div>
            <div class="budget">
                <div class="budget__title">
                    This is your budget, <span class="budget__title--month">${this._user.displayName.split(' ')[0]}</span>:
                </div>
                
                <div class="budget__value">%%</div>
                
                <div class="budget__income clearfix">
                    <div class="budget__income--text">Income</div>
                    <div class="right">
                        <div class="budget__income--value"></div>
                       <!-- <div class="budget__income--percentage">0 %</div> -->
                    </div>
                </div>
                
                <div class="budget__expenses clearfix">
                    <div class="budget__expenses--text">Expenses</div>
                    <div class="right clearfix">
                        <div class="budget__expenses--value"></div>
                        <div class="budget__expenses--percentage"></div>
                    </div>
                </div>
            </div>
        </div>
        
        
        
        <div class="bottom">
            <div class="add">
                <div class="add__container">
                    <select class="add__type">
                        <option value="inc" selected>income</option>
                        <option value="exp">expense</option>
                    </select>
                    <input type="text" class="add__description" placeholder="Add description">
                    <input type="number" class="add__value" placeholder="Value">
                    <button id="add__btn" class="add__btn btn btn-success"><i class="ion-ios-checkmark-outline">Add</i></button>
                </div>
                
               
            </div >
            <div class="toggle_buttons buttons_choise text-center">
                <div class="btn-group btn-group-toggle " data-toggle="buttons">
                      <label class="btn btn-primary active" id="show_income">
                        <input type="radio" name="options"  autocomplete="off" checked>Show income
                      </label>
                      <label class="btn btn-primary" id="show_expenses">
                        <input type="radio" name="options"  autocomplete="off">Show expenses
                      </label>
                      
                </div>
            </div>
            <div id="transactions_table">
            </div>
        </div>  
        `;

    }




}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Transactions; });
class Transactions {
    constructor(element, userMail, dataCallback) {
        this._el = element;
        this._dataCallback = dataCallback;
        this._db = firebase.firestore();
        this._userMail = userMail;

        this._render();

        this._el.addEventListener('click', event => {
            if (event.target.tagName === 'P') {
                let id = event.target.closest('p').innerHTML;
                console.log(event.target.closest('li'));
                this._deleteTransaction(id, event.target.closest('li'));

            }
        })
    }


    /**
     * Adding a transaction to HTML
     * @param id
     * @param transaction
     * @private
     */
    _addTransactionToUI(id, transaction) {

        //Adding to HTML
        let elem = document.createElement('div');

        elem.innerHTML = `
            <div class="item-a clearfix" data-id=${id}>
                <div class="item__description"><span>${transaction.description}</span><span class="item-time">${transaction.time}</span></div>
                
                      <div class="right clearfix">
                           <div class="item__value">${transaction.amount}</div>
                           <div class="item__delete">
                                <button class="item__delete--btn deleteb">x</button>
                           </div>
                      </div>                   
            </div>     
                            `;


        if (transaction.type === 'inc') {

            this._el.querySelector('.income__list').insertBefore(elem, this._el.querySelector('.income__list').children[0]);
        } else {
            this._el.querySelector('.expenses__list').appendChild(elem);
        }

    }

    /**
     * Save transaction to firebase firestore
     * @param id
     * @param description
     * @param amount
     * @param type
     * @param userMail
     * @param time
     * @private
     */
    _addTransactionToDB(id, description, amount, type, userMail, time) {
        this._db.collection("transactions").doc(id.toString()).set({
            amount: amount,
            description: description,
            type: type,
            user_id: userMail,
            time: time,
        })
            .then(function() {
                //   console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        /**
         * Adding a Transaction to HTML
         */
        this._addTransactionToUI(id, {
            amount: amount,
            description: description,
            type: type,
            userMail: userMail,
            time:time
        });

    }

    /**
     * Delete transaction from HTML and from firebase firestore
     * @param id
     * @param element
     * @private
     */
    _deleteTransaction(id, element) {

        element.parentElement.removeChild(element);
        console.log('child removed');
        this._db.collection("transactions").doc(id).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }


    /**
     * Gets all saved transactions andd calls method to add the to HTML
     * @private
     */
    _getSavedTransactions() {
        // saving context for calling other methods
        let self = this;

        this._db.collection("transactions").where("user_id", "==", this._userMail)
            .get()
            .then(function(querySnapshot) {

                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    const data = doc.data();
                    self._addTransactionToUI(doc.id,{description: data.description,amount: data.amount, type: data.type,userMail: data.user_id, time:data.time || `${new Date().getDate() + '.'+Number(new Date().getMonth()+1)}`});
                    self._dataCallback({
                        id: doc.id,
                        description: data.description,
                        amount: data.amount,
                        type: data.type,
                        userMail: data.user_id,
                        time: data.time
                    }, 'add');
                });


            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }

    /**
     * Render all Transactions in the HTML
     * @private
     */
    _render() {

        this._el.innerHTML = `<div class="container clearfix">
                <div class="income">
                    <h2 class="icome__title">Income</h2>
                      
                    <div class="income__list">
                       
                     
                    </div>
                     
                </div>
                
                
                
                <div class="expenses invisible">
                  <h2 class="expenses__title">Expenses</h2>  
                    
                    <div class="expenses__list">
                       
                   
                    </div>
                </div>
            </div>
        `;
        this._getSavedTransactions();
    }

}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map