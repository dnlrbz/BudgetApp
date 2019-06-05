export default class Transactions {
    constructor(element, userMail) {
        this._el = element;
        //this._app = firebase.app();
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



    _getAllTransactionsByUserMail(email) {
        let resultArray = [];

        firebase.firestore().collection("transactions").where("user_id", "==", email)
            .get()
            .then(function(querySnapshot) {

                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    let transaction = doc.data();
                    resultArray.push(transaction);
                });

                //console.log(resultArray);
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        return resultArray;
    };


    _addTransaction(id, description, amount, type, userMail) {

        //Adding to HTML
        let transaction = document.createElement('div');

        transaction.innerHTML = `
            <div class="item clearfix" data-id=${id}>
                <div class="item__description">${description}</div>
                      <div class="right clearfix">
                           <div class="item__value">${amount}</div>
                           <div class="item__delete">
                               <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                           </div>
                      </div>                   
            </div>    
                            `;
        if (type === 'inc') {
            this._el.querySelector('.income__list').appendChild(transaction);
        } else {
            this._el.querySelector('.expenses__list').appendChild(transaction);
        }

        //Adding to database:

        this._db.collection("transactions").doc(id.toString()).set({
            amount: amount,
            description: description,
            type: type,
            user_id: userMail
        })
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });


    }

    _deleteTransaction(id, element) {
        element.parentElement.removeChild(element);
        console.log('child removed');
        this._db.collection("transactions").doc(id).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }


    _render() {
        let self = this;
        /*
        self._el.innerHTML = `
        <div class="income__list">
        <h2 class="icome__title">Income</h2>
        
        </div>
        
        `;
        */
        self._el.innerHTML = `<div class="container clearfix">
                <div class="income">
                    <h2 class="icome__title">Income</h2>
                      
                    <div class="income__list">
                       
                      <!--
                        <div class="item clearfix" id="income-0">
                            <div class="item__description">Salary</div>
                            <div class="right clearfix">
                                <div class="item__value">+ 2,100.00</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="item clearfix" id="income-1">
                            <div class="item__description">Sold car</div>
                            <div class="right clearfix">
                                <div class="item__value">+ 1,500.00</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
                       
                     -->   
                    </div>
                     
                </div>
                
                
                
                <div class="expenses">
                  <h2 class="expenses__title">Expenses</h2>  
                    
                    <div class="expenses__list">
                       
                        <!--
                        <div class="item clearfix" id="expense-0">
                            <div class="item__description">Apartment rent</div>
                            <div class="right clearfix">
                                <div class="item__value">- 900.00</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="item clearfix" id="expense-1">
                            <div class="item__description">Grocery shopping</div>
                            <div class="right clearfix">
                                <div class="item__value">- 435.28</div>
                                <div class="item__percentage">10%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
                        -->
                        
                    </div>
                </div>
            </div>
`


/*
        this._db.collection("transactions").get().then(function(querySnapshot) {

            querySnapshot.forEach(function(doc) {
                const data = doc.data();
                self._addTransaction(doc.id, data.description, data.amount, data.type, data.user_id);

            });


        })
            .catch(err => console.log(err));
*/

        this._db.collection("transactions").where("user_id", "==", this._userMail)
            .get()
            .then(function(querySnapshot) {

                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    const data = doc.data();
                    self._addTransaction(doc.id, data.description, data.amount, data.type, data.user_id);
                });

                //console.log(resultArray);
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

    }


}