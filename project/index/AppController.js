
import Transactions from "./Transactions.js";

export default class AppController {
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

                self._trans = new Transactions(document.getElementById('transactions_table'), self._user.email, self._updateData.bind(self));
                self._updateData();
            } else {
                self._renderBeforeLogin();
                console.log('not logged in');
            }

        });



        this._addEventListeners();




    }

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

    _updateBudgetUI() {
        //console.log('new total: ' +this._data.total);
        document.querySelector('.budget__value').innerHTML = this._data.total + '€';
        document.querySelector('.budget__income--value').innerHTML = this._data.income + '€';
        document.querySelector('.budget__expenses--value').innerHTML = this._data.expenses + '€';
        document.querySelector('.budget__expenses--percentage').innerHTML = this._data.expensesPercentage + '%';
    }

    _addEventListeners() {

        document.addEventListener('DOMContentLoaded', event => {
            const app = firebase.app();
            //console.log('dom content loaded');
        });

        this._el.addEventListener('click', event => {
            if (event.target.id === 'login-btn') {
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
                this._trans._addTransaction.call(this._trans, Math.round(Math.random()*100000000).toString(), description.value, value.value, type, userMail);

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
                let itemToDelete = event.target.closest('.item');
                let idToDelete = itemToDelete.dataset.id;
                this._trans._deleteTransaction(idToDelete, itemToDelete);
            }

            //console.log(event.target);

        });


    }

    _logout() {
        const self = this;
        firebase.auth().signOut().then(function() {
            console.log('Logged out');
            self._renderBeforeLogin();
        }).catch(function(error) {
            console.log('Failed to log out');
        });
    }

    _googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {
            this._user = result.user;
            //console.log('logged in ' + this._user.displayName);
            this._renderAfterLogin();

        })
            .catch(err => console.log(err));
    }


    _renderBeforeLogin() {
        this._el.innerHTML = `
        
        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
              <ol class="carousel-indicators">
                <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              </ol>
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img src="./images/iphone.jpg" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                  <img src="./images/mac.jpg" class="d-block w-100" alt="...">
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
                    <button class="btn btn-primary btn-lg btn-block text-center" id="login-btn">Login with google</button>
              </div>
        </div>
        `

    }


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
                        <option value="inc" selected>+</option>
                        <option value="exp">-</option>
                    </select>
                    <input type="text" class="add__description" placeholder="Add description">
                    <input type="number" class="add__value" placeholder="Value">
                    <button id="add__btn" class="add__btn btn btn-primary"><i class="ion-ios-checkmark-outline">Add</i></button>
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