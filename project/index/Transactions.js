export default class Transactions {
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