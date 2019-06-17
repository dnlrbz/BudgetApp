!function(e){var t={};function n(i){if(t[i])return t[i].exports;var s=t[i]={i:i,l:!1,exports:{}};return e[i].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(i,s,function(t){return e[t]}.bind(null,s));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);class i{constructor(e,t,n){this._el=e,this._dataCallback=n,this._db=firebase.firestore(),this._userMail=t,this._render(),this._el.addEventListener("click",e=>{if("P"===e.target.tagName){let t=e.target.closest("p").innerHTML;console.log(e.target.closest("li")),this._deleteTransaction(t,e.target.closest("li"))}})}_addTransactionToUI(e,t){let n=document.createElement("div");n.innerHTML=`\n            <div class="item-a clearfix" data-id=${e}>\n                <div class="item__description"><span>${t.description}</span><span class="item-time">${t.time}</span></div>\n                \n                      <div class="right clearfix">\n                           <div class="item__value">${t.amount}</div>\n                           <div class="item__delete">\n                                <button class="item__delete--btn deleteb">x</button>\n                           </div>\n                      </div>                   \n            </div>     \n                            `,"inc"===t.type?this._el.querySelector(".income__list").insertBefore(n,this._el.querySelector(".income__list").children[0]):this._el.querySelector(".expenses__list").appendChild(n)}_addTransactionToDB(e,t,n,i,s,a){this._db.collection("transactions").doc(e.toString()).set({amount:n,description:t,type:i,user_id:s,time:a}).then(function(){}).catch(function(e){console.error("Error writing document: ",e)}),this._addTransactionToUI(e,{amount:n,description:t,type:i,userMail:s,time:a})}_deleteTransaction(e,t){t.parentElement.removeChild(t),console.log("child removed"),this._db.collection("transactions").doc(e).delete().then(function(){console.log("Document successfully deleted!")}).catch(function(e){console.error("Error removing document: ",e)})}_getSavedTransactions(){let e=this;this._db.collection("transactions").where("user_id","==",this._userMail).get().then(function(t){t.forEach(function(t){const n=t.data();e._addTransactionToUI(t.id,{description:n.description,amount:n.amount,type:n.type,userMail:n.user_id,time:n.time||`${(new Date).getDate()+"."+Number((new Date).getMonth()+1)}`}),e._dataCallback({id:t.id,description:n.description,amount:n.amount,type:n.type,userMail:n.user_id,time:n.time},"add")})}).catch(function(e){console.log("Error getting documents: ",e)})}_render(){this._el.innerHTML='<div class="container clearfix">\n                <div class="income">\n                    <h2 class="icome__title">Income</h2>\n                      \n                    <div class="income__list">\n                       \n                     \n                    </div>\n                     \n                </div>\n                \n                \n                \n                <div class="expenses invisible">\n                  <h2 class="expenses__title">Expenses</h2>  \n                    \n                    <div class="expenses__list">\n                       \n                   \n                    </div>\n                </div>\n            </div>\n        ',this._getSavedTransactions()}}new class{constructor({element:e}){this._el=e;let t=this;this._data={transactionsArray:[],total:0,income:0,expenses:0,expensesPercentage:0},firebase.auth().onAuthStateChanged(function(e){e?(t._user=e,t._renderAfterLogin(),console.log("already logged in"),t._trans=new i(document.getElementById("transactions_table"),t._user.email,t._updateData.bind(t)),t._updateData()):(t._renderBeforeLogin(),console.log("not logged in"))}),this._addEventListeners()}_updateData(e,t){"add"===t&&this._data.transactionsArray.push(e),"remove"===t&&(this._data.transactionsArray=this._data.transactionsArray.filter(t=>t.id!==e.id));let n=Number(this._data.transactionsArray.reduce(function(e,t){return"inc"===t.type?e+Number(t.amount):e-Number(t.amount)},0));this._data.total=n.toFixed(2);let i=Number(this._data.transactionsArray.reduce(function(e,t){return"inc"===t.type?e+Number(t.amount):e},0));this._data.income=i.toFixed(2);let s=Number(this._data.transactionsArray.reduce(function(e,t){return"exp"===t.type?e+Number(t.amount):e},0));this._data.expenses=s.toFixed(2);let a=100*Number(+this._data.expenses/this._data.income);this._data.expensesPercentage=isFinite(a)?a.toFixed(1):100,this._updateBudgetUI()}_updateBudgetUI(){document.querySelector(".budget__value").innerHTML=this._data.total+"€",document.querySelector(".budget__income--value").innerHTML=this._data.income+"€",document.querySelector(".budget__expenses--value").innerHTML=this._data.expenses+"€",document.querySelector(".budget__expenses--percentage").innerHTML=this._data.expensesPercentage+"%"}_addEventListeners(){document.addEventListener("DOMContentLoaded",e=>{firebase.app()}),this._el.addEventListener("click",e=>{if("login-btn"!==e.target.id&&"login-btn"!==e.target.parentElement.id||this._googleLogin(),"logout-btn"===e.target.id&&this._logout(),"add__btn"===e.target.id||"add__btn"===e.target.parentElement.id){let e=document.querySelector(".add__type").value,t=document.querySelector(".add__description"),n=document.querySelector(".add__value");if(""===t.value||0===n.value||""===n.value)return;console.log(e,t.value,n.value,this._user.email);let i=this._user.email,s=new Date,a=s.getDate()+"."+Number(s.getUTCMonth()+1),o=Math.round(1e8*Math.random()).toString();this._updateData({id:o,description:t.value,amount:n.value,type:e,userMail:i,time:a},"add"),this._trans._addTransactionToDB.call(this._trans,o,t.value,n.value,e,i,a),t.value="",n.value=""}if("show_expenses"!==e.target.id&&"show_income"!==e.target.id||("show_expenses"===e.target.id?(document.querySelector(".expenses").classList.remove("invisible"),document.querySelector(".income").classList.add("invisible")):(document.querySelector(".expenses").classList.add("invisible"),document.querySelector(".income").classList.remove("invisible"))),e.target.classList.contains("deleteb")){let t=e.target.closest(".item-a"),n=t.dataset.id;this._updateData({id:n},"remove"),this._trans._deleteTransaction(n,t)}})}_logout(){const e=this;firebase.auth().signOut().then(function(){console.log("Logged out"),e._renderBeforeLogin()}).catch(function(e){console.log("Failed to log out")})}_googleLogin(){const e=new firebase.auth.GoogleAuthProvider;firebase.auth().signInWithPopup(e).then(e=>{this._user=e.user,this._renderAfterLogin()}).catch(e=>console.log(e))}_renderBeforeLogin(){this._el.innerHTML='\n        \n        <div id="carouselExampleIndicators" class="carousel slide text-center" data-ride="carousel">\n             \n              <div class="carousel-inner">\n                <div class="carousel-item active item min-vh-100">\n                  <img src="../public/images/iphone.jpg" class="d-block min-vh-100 zoom" alt="...">\n                </div>\n                <div class="carousel-item item min-vh-100">\n                  <img src="../public/images/mac.jpg" class="d-block min-vh-100 zoom" alt="...">\n                </div>\n              </div>\n              <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">\n                <span class="carousel-control-prev-icon" aria-hidden="true"></span>\n                <span class="sr-only">Previous</span>\n              </a>\n              <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">\n                <span class="carousel-control-next-icon" aria-hidden="true"></span>\n                <span class="sr-only">Next</span>\n              </a>\n              \n              <div class="main-text hidden-xs hidden-sm text-center">\n                    <p class="h1 main-text-item">Secure and free personal budget tracker</span></p>\n                    \n                    <button class="btn btn-primary btn-lg google text-center" id="login-btn">\n                    <p class="button-text">Log in with Google</p>\n                    </button>\n              </div>\n        </div>\n        '}_renderAfterLogin(){this._el.innerHTML=`\n            <div id="transactions-container">\n            \n            </div> \n            \n            \n            <div class="top">\n            <div class="control_buttons">\n                <button class="btn-primary" id="logout-btn">Logout</button>\n            </div>\n            <div class="budget">\n                <div class="budget__title">\n                    This is your budget, <span class="budget__title--month">${this._user.displayName.split(" ")[0]}</span>:\n                </div>\n                \n                <div class="budget__value">%%</div>\n                \n                <div class="budget__income clearfix">\n                    <div class="budget__income--text">Income</div>\n                    <div class="right">\n                        <div class="budget__income--value"></div>\n                       \x3c!-- <div class="budget__income--percentage">0 %</div> --\x3e\n                    </div>\n                </div>\n                \n                <div class="budget__expenses clearfix">\n                    <div class="budget__expenses--text">Expenses</div>\n                    <div class="right clearfix">\n                        <div class="budget__expenses--value"></div>\n                        <div class="budget__expenses--percentage"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        \n        \n        \n        <div class="bottom">\n            <div class="add">\n                <div class="add__container">\n                    <select class="add__type">\n                        <option value="inc" selected>income</option>\n                        <option value="exp">expense</option>\n                    </select>\n                    <input type="text" class="add__description" placeholder="Add description">\n                    <input type="number" class="add__value" placeholder="Value">\n                    <button id="add__btn" class="add__btn btn btn-success"><i class="ion-ios-checkmark-outline">Add</i></button>\n                </div>\n                \n               \n            </div >\n            <div class="toggle_buttons buttons_choise text-center">\n                <div class="btn-group btn-group-toggle " data-toggle="buttons">\n                      <label class="btn btn-primary active" id="show_income">\n                        <input type="radio" name="options"  autocomplete="off" checked>Show income\n                      </label>\n                      <label class="btn btn-primary" id="show_expenses">\n                        <input type="radio" name="options"  autocomplete="off">Show expenses\n                      </label>\n                      \n                </div>\n            </div>\n            <div id="transactions_table">\n            </div>\n        </div>  \n        `}}({element:document.getElementById("app")})}]);