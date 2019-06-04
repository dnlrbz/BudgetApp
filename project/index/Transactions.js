export default class Transactions {
    constructor(element) {
        this._el = element;
        //this._app = firebase.app();
        this._db = firebase.firestore();
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


    _addTransaction(transactionText) {
        let transaction = document.createElement('LI');
        transaction.innerHTML = `<p data-id="${transactionText}">${transactionText}</p>`;
        this._el.querySelector('#transactions-list').appendChild(transaction);
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
        self._el.innerHTML = `
        <ul id="transactions-list">
          
        </ul>
        `;

        this._db.collection("transactions").get().then(function(querySnapshot) {

            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                //resultArray.push(doc.data());
                self._addTransaction(doc.id);
            });


        })
            .catch(err => console.log(err));

    }
}