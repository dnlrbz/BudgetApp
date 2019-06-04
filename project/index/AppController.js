
import Transactions from "./Transactions.js";

export default class AppController {
    constructor({element}) {
        this._el = element;
        this._renderBeforeLogin();

        //let ds = new DataService();

        document.addEventListener('DOMContentLoaded', event => {
            const app = firebase.app();
            console.log('dom content loaded');
        })
        this._el.addEventListener('click', event => {
           if (event.target.id === 'login-btn') {
               this._googleLogin();
           }
            if (event.target.id === 'logout-btn') {
                this._logout();
            }
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
            const user = result.user;
            console.log('logged in ' + user.displayName);
            this._renderAfterLogin();
            let trans = new Transactions(document.getElementById('transactions-container'));
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
            <button id="logout-btn">Logout</button>
            <div id="transactions-container">
            
            </div>   
        `;

    }




}