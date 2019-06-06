
import Transactions from "./Transactions.js";

export default class AppController {
    constructor({element}) {
        this._el = element;
        let self = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                self._renderAfterLogin();
                console.log('already logged in');
                self._user = user;
                self._trans = new Transactions(document.getElementById('transactions_table'), self._user.email);
            } else {
                self._renderBeforeLogin();
                console.log('not logged in');
            }
        });



        this._addEventListeners();




    }

    _addEventListeners() {

        document.addEventListener('DOMContentLoaded', event => {
            const app = firebase.app();
            console.log('dom content loaded');
        });

        this._el.addEventListener('click', event => {
            if (event.target.id === 'login-btn') {
                this._googleLogin();
            }
            if (event.target.id === 'logout-btn') {
                this._logout();
            }

            if (event.target.id === 'add__btn' || event.target.parentElement.id === 'add__btn') {
                console.log('add button fired');

                let type = document.querySelector('.add__type').value;
                let description = document.querySelector('.add__description');
                let value = document.querySelector('.add__value');
                if (description!=='' && value !=='') {
                    console.log(type, description, value, this._user.email);
                    console.log('random id: ' + Math.round(Math.random()*100000000));
                    let userMail = this._user.email;
                    this._trans._addTransaction.call(this._trans, Math.round(Math.random()*100000000), description.value, value.value, type, userMail);
                }
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

            console.log(event.target);

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
            console.log('logged in ' + this._user.displayName);
            this._renderAfterLogin();

        })
            .catch(err => console.log(err));
    }


    _renderBeforeLogin() {
        this._el.innerHTML = `
        <button id="login-btn">Login with google</button>
        <button id="logout-btn">Logout</button>
        `

    }


    _renderAfterLogin() {
        this._el.innerHTML = `
            <div id="transactions-container">
            
            </div> 
            
            
            <div class="top">
            <div class="control_buttons">
                <button class="logout-btn" id="logout-btn">Logout</button>
            </div>
            <div class="budget">
                <div class="budget__title">
                    Available Budget in <span class="budget__title--month">%Month%</span>:
                </div>
                
                <div class="budget__value">0 €</div>
                
                <div class="budget__income clearfix">
                    <div class="budget__income--text">Income</div>
                    <div class="right">
                        <div class="budget__income--value">%value%</div>
                       <!-- <div class="budget__income--percentage">0 %</div> -->
                    </div>
                </div>
                
                <div class="budget__expenses clearfix">
                    <div class="budget__expenses--text">Expenses</div>
                    <div class="right clearfix">
                        <div class="budget__expenses--value">%value%</div>
                        <div class="budget__expenses--percentage">%percentage%</div>
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