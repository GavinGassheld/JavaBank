import React, { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import AccountActions from "../components/AccountActions";
import MyAccounts from "../components/MyAccounts";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MyPages(props) {
    let user = reactLocalStorage.getObject("user");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [radioShow, setRadioShow] = useState(false);
    const handleRadioClose = () => setRadioShow(false);
    const handleRadioShow = () => setRadioShow(true);
    const [accountRadio, setAccountRadio] = useState(true);
    const handleAccountRadioFalse = () => setAccountRadio(false);
    const handleAccountRadioTrue = () => setAccountRadio(true);
    useEffect(() => {
        let myAccount = accountRadio;
        if(radioShow) {
            fillTransferOptions(user, myAccount);
        }
    });
    
    async function newAccount() {
        let accountName = document.getElementById('accountName').value;
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "accountName": accountName,
                "id": reactLocalStorage.getObject("user").id
            })
        };
        const response = await fetch('http://localhost:8080/addmyaccount', requestOptions);
        const json = await response.json();
        if (json.success) {
            user = json;
            reactLocalStorage.setObject("user", user);
            updatePage(user);
            handleClose();
        }
    }; 
    
    function signOut() {
        reactLocalStorage.setObject("user", null);
        reactLocalStorage.set("signedIn", false);
        window.location.href = "http://localhost:3000";
    }
    
    const openAccount = () => {
        let account = document.getElementById('account');
        account.setAttribute("style", "display: flex;");
        document.getElementById('accounts').setAttribute("style", "display: flex;");
        document.getElementById('assets').innerText = ` ${user.assets} SEK`;
        showTransactionsOtherAccounts();
    };
    
    const fillWDSelect = (user) => {
        let select = document.getElementById('wdSelect');
        let html = `<option selected disabled>Välj konto</option>`;
        for (let [key, value] of Object.entries(user.myAccounts)) {
            html += `<option value="${key}">${value.accountName}</option>`;
        }
        select.innerHTML = html;
    };

    const showMyAccounts = (user) => {
        let myAccounts = user.myAccounts;
        if (myAccounts !== null) {
            let html = "<ul>";
            for (let value of Object.values(myAccounts)) {
                let collapseId = Math.floor(Math.random() * 10000);
                html += `<li>
                    <a 
                        class="text-black text-decoration-none" 
                        data-bs-toggle="collapse" 
                        href="#collapse${collapseId}" 
                        role="button" 
                        aria-expanded="false" 
                        aria-controls="collapse${collapseId}"
                    >
                        <span class="fw-bold">${value.accountName} : ${value.assets} SEK</span>
                    </a>
                </li>`;
                html += `<div class="collapse" id="collapse${collapseId}">
                    <div class="card card-body">                        
                        <table>                            
                            <tr>                                
                                <th>Kontonr</th>                                
                                <th>Tillgångar</th>                            
                            </tr>                            
                            <tr>                                
                                <td>${value.accountNumber}</td>                                
                                <td>${value.assets} SEK</td>                            
                            </tr>                        
                        </table>                    
                    </div>                
                </div> <hr>`;      
            }      
            html += "</ul>";
            document.getElementById('myAccountsList').innerHTML = html;    
        }  
    };  

    const fillTransferOptions = (user, myAccount) => {    
        if (myAccount === undefined || myAccount === null || user === null || user === undefined) {      
            return;    
        }    
        let from_html = `<option selected disabled>Från</option>`;    
        let my_accounts_html = '';   
        for (let [key, value] of Object.entries(user.myAccounts)) {      
            my_accounts_html += `<option value="${key}:${user.id}">${value.accountName}:${key}</option>`;    
        }    
        from_html += my_accounts_html;    
        let fromSelect = document.getElementById('fromSelect');
        fromSelect.innerHTML = from_html;    
        let to_html = `<option selected disabled>Till</option>`;    
        if (myAccount) {      
            to_html += my_accounts_html;    
        } else {      
            for (let [key, value] of Object.entries(user.otherAccounts)) {     
                to_html += `<option value="${key}:${value.name}">${value.name}${key}</option>`;      
            }    
        }    
        document.getElementById('toSelect').innerHTML = to_html;  
    };  
    
    const makeTransfer = () => {    
        if (accountRadio) {      
            makeTransferMyAccounts();    
        } else {      
            makeTransferOther();    
        }  
    };  
    
    async function makeTransferOther() {    
        let from = document.getElementById('fromSelect').value;    
        let to = document.getElementById('toSelect').value;    
        if (from === 'Från' || to === 'Till') {      
            alert('Du måste välja både konto och mottagare.');      
            return;    
        }    
        from = from.split(':');    
        to = to.split(':');    
        let fromId = from[1];    
        let fromAccountId = from[0];    
        let toAccountId = to[0];    
        let toName = to[1];    
        let datetime = getDateTime();    
        let amount = document.getElementById('transferAmount').value;    
        if (amount === '') {      
            alert('Du måste fylla i vilken summa du vill överföra.');      
            return;    
        }    
        
        const requestOptions = {      
            method: 'POST',      
            headers: {        'Content-Type': 'application/json'      },      
            body: JSON.stringify({        
                'datetime': datetime,        
                'fromId': fromId,        
                'fromAccountId': fromAccountId,        
                'toAccountId': toAccountId,        
                'toName': toName,        
                'amount': amount      
            })    
        };    
        const response = await fetch('http://localhost:8080/maketransfer', requestOptions);    
        const json = await response.json();    
        if (json.success) {            
            user = json;
            reactLocalStorage.setObject("user", user);      
            updatePage(user); 
            handleRadioClose();
        } else {      
            alert('Inte tillräckligt med pengar på kontot!');    
        }  
    };  
    
    async function makeTransferMyAccounts() {    
        let from = document.getElementById('fromSelect').value;    
        let to = document.getElementById('toSelect').value;    
        if (from === 'Från' || to === 'Till') {      
            alert('Du måste välja både konto och mottagare.');      
            return;    
        }    
        from = from.split(':');    
        let id = from[1];    
        let fromAccountId = from[0];    
        let toAccountId = to.split(':')[0];    
        if(fromAccountId === toAccountId) {
            alert("Du får inte ha samma avsändare och mottagare!");
            return;
        }
        let datetime = getDateTime();    
        let amount = document.getElementById('transferAmount').value;    
        if (amount === '') {      
            alert('Du måste fylla i vilken summa du vill överföra.');      
            return;    
        }    
        const requestOptions = {      
            method: 'POST',      
            headers: {        'Content-Type': 'application/json'      },      
            body: JSON.stringify({        
                'datetime': datetime,        
                'id': id,        
                'fromAccountId': fromAccountId,        
                'toAccountId': toAccountId,        
                'amount': amount      
            })    
        };    
        const response = await fetch('http://localhost:8080/maketransfermyaccounts', requestOptions);    
        const json = await response.json();    
        if (json.success) {      
            user = json;
            reactLocalStorage.setObject("user", user);      
            updatePage(user);   
            handleRadioClose();
            return;
        } else {      
            alert('Inte tillräckligt med pengar på kontot!');    
        }  
    };  

    const updatePage = (user) => {    
        showTransactions(user);    
        showOtherAccounts(user);    
        showMyAccounts(user);    
        // fillTransferOptions(user, accountRadio);    
        fillWDSelect(user);  
    };  

    const showTransactionsOtherAccounts = () => {    
        if (user !== null || user !== undefined) {      
            showTransactions(user);      
            showOtherAccounts(user);      
            showMyAccounts(user);      
            // fillTransferOptions(user, accountRadio);      
            fillWDSelect(user);    
        }  
    };  
    
    const showOtherAccounts = (user) => {    
        let otherAccounts = user.otherAccounts;    
        if (otherAccounts !== null) {      
            let html = "<ul>";
            for (let value of Object.values(otherAccounts)) {        
                let collapseId = Math.floor(Math.random() * 10000);        
                html += `<li><a class="text-black text-decoration-none" data-bs-toggle="collapse" href="#collapse${collapseId}" role="button" aria-expanded="false" aria-controls="collapse${collapseId}"><span class="fw-bold">${value.name}</span></a></li>`;        
                html += `<div class="collapse" id="collapse${collapseId}">                    
                    <div class="card card-body">                        
                        <table>                            
                            <tr>                                
                                <th>Namn</th>                                
                                <th>Kontonummer</th>                            
                            </tr>                            
                            <tr>                                
                                <td>${value.name}</td>                                
                                <td>${value.id}</td>                            
                            </tr>                        
                        </table>                    
                    </div>                
                </div> <hr>`;      
            }      
            html += "</ul>";    
            document.getElementById('accountsList').innerHTML = html;    
        }  
    };  
        
    async function addAccountApi() {    
        let accountIdElement = document.getElementById('addAccountID');    
        let accountNameElement = document.getElementById('addAccountName');    
        if (accountIdElement.value === undefined || accountIdElement.value === "" || accountNameElement.value === undefined || accountNameElement.value === "") {      
            alert(`Du måste fylla i både id och namn på det mottagande kontot`);  
            return;  
        }    
        const requestOptions = {      
            method: 'POST',      
            headers: {        'Content-Type': 'application/json'      },      
            body: JSON.stringify({        
                'id': reactLocalStorage.getObject("user").id,        
                'accountId': accountIdElement.value,        
                'accountName': accountNameElement.value      
            })    
        };    
        const response = await fetch('http://localhost:8080/addaccount', requestOptions);    
        const json = await response.json();    
        if (json.success) {     
            user = json; 
            showOtherAccounts(user);     
            reactLocalStorage.setObject("user", user);    
            accountIdElement.value = "";    
            accountNameElement.value = "";   
            return;    
        }   
        alert("Kontot fanns inte eller så har du redan lagt till det.");  
        return;  
    };  
    
    async function withdraw() {    
        let withdraw = document.getElementById('wdAmount');    
        let amount = withdraw.value;    
        let accountNumber = document.getElementById('wdSelect').value;    
        let datetime = getDateTime();    
        const requestOptions = {      
            method: 'POST',      
            headers: {        'Content-Type': 'application/json'      },      
            body: JSON.stringify({        
                'id': reactLocalStorage.getObject("user").id,        
                'accountNumber': accountNumber,        
                'amount': amount,        
                'datetime': datetime      
            })    
        };    
        const response = await fetch('http://localhost:8080/withdraw', requestOptions);    
        const json = await response.json();    
        if (json.success) {     
            user = json;  
            reactLocalStorage.setObject("user", user);      
            document.getElementById('assets').innerText = user.assets + 'SEK';      
            withdraw.value = "";      
            updatePage(user);
            return;    
        }
        alert("Kolla så det finns tillräckligt med pengar på ditt konto!");
    };  
            
    const getDateTime = () => {    
        var today = new Date();    
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();    
        let hours = today.getHours();    
        if (hours < 10) {      
            hours = `0${hours}`;    
        }    
        let minutes = today.getMinutes();    
        if (minutes < 10) {      
            minutes = `0${minutes}`;    
        }    
        let seconds = today.getSeconds();    
        if (seconds < 10) {      
            seconds = `0${seconds}`;    
        }    
        var time = hours + ":" + minutes + ":" + seconds;    
        return `${date} ${time}`;  
    };  
    
    async function deposit() {    
        let deposit = document.getElementById('wdAmount');    
        let amount = deposit.value;    
        let accountNumber = document.getElementById('wdSelect').value;    
        let datetime = getDateTime();    
        const requestOptions = {      
            method: 'POST',      
            headers: {        'Content-Type': 'application/json'      },      
            body: JSON.stringify({        
                'id': reactLocalStorage.getObject("user").id,        
                'accountNumber': accountNumber,        
                'amount': amount,        
                'datetime': datetime      
            })    
        };    
        const response = await fetch('http://localhost:8080/deposit', requestOptions);    
        const json = await response.json();    
        if (json.success) {   
            user = json;   
            reactLocalStorage.setObject("user", user);      
            document.getElementById('assets').innerText = user.assets + 'SEK';      
            deposit.value = "";      
            updatePage(user);    
        }  
    };  
            
    const showTransactions = (user) => {    
        let transaction_log = sortTransactions(user.transaction_log);    
        if (transaction_log !== null) {      
            let html = "<ul>";      
            for (let i = 0; i < transaction_log.length; i++) {
                let json = transaction_log[i];        
                let key = Object.keys(json)[0];     
                let value = json[key];        
                let color_class = "";        
                if (value.note === 'withdraw' || value.note === 'outgoing') {          
                    color_class = "bg-danger";        
                } else if (value.note === 'deposit' || value.note === 'incoming') {          
                    color_class = "bg-success";        
                } else if (value.note === 'transfer') {          
                    color_class = "bg-primary";        
                } else {          
                    color_class = "bg-warning";        
                }        
                // delete value['note'];        
                let collapseId = Math.floor(Math.random() * 10000);        
                html += `<li><a                                 
                    class="text-black text-decoration-none"                                 
                    data-bs-toggle="collapse"                                 
                    href="#collapse${collapseId}"                                 
                    role="button"                                 
                    aria-expanded="false"                                 
                    aria-controls="collapse${collapseId}"                            
                >                            
                <span class="fw-bold">${key}</span> :                             
                <span class="border rounded ${color_class}">                                
                    ${value.amount} SEK                            
                </span></a></li>`;        
                html += `<div class="collapse" id="collapse${collapseId}">                    
                    <div class="card card-body">                        
                        <table>                            
                            <tr>                                
                                <th>Skickat från</th>                                
                                <th>Skickat till</th>                                
                                <th>Summa</th>                            
                            </tr>                            
                            <tr>                                
                                <td>${value.fromAccount}</td>                                
                                <td>${value.toAccount}</td>                                
                                <td>${value.amount} SEK</td>                            
                            </tr>                        
                        </table>                    
                    </div>                
                </div> <hr>`;      
            }      
            html += "</ul>";      
            document.getElementById('transactions').innerHTML = html;    
        }  
    };  
            
    const sortTransactions = transaction_log => {    
        let transactions = [];    
        let datetimeJson = {};    
        let datetimeTransactions = {};    
        let index = 0;    
        for (let key of Object.keys(transaction_log)) {      
            //key is datetime string      
            datetimeJson = getDatetimeJson(key);      
            //find correct index      
            for (let i = 0; i < transactions.length; i++) { 
                index = i + 1;       
                datetimeTransactions = transactions[i].datetimeJson;        
                let dateCompare = datetimeJson.date.localeCompare(datetimeTransactions.date, {numeric: "true"});        
                if (dateCompare > 0) {          
                    index = i;          
                    break;        
                } else if (dateCompare === 0) {          
                    //same date, compare time          
                    let timeCompare = datetimeJson.time.localeCompare(datetimeTransactions.time, {numeric: "true"});          
                    if (timeCompare >= 0) {            
                        //equal time gets put before previous entry            
                        index = i;            
                        break;          
                    }        
                }
            }      
            transactions.splice(index, 0, {        "key": key,        "datetimeJson": datetimeJson      });      
            index = 0;    
        }    
        let transactions_return = [];    
        for (let i = 0; i < transactions.length; i++) {      
            let key = transactions[i].key;      
            let value = transaction_log[key];      
            let json = {};      
            json[key] = value;      
            transactions_return[i] = json; 
        }    
        return transactions_return;  
    };  
            
    const getDatetimeJson = datetime => {    
        let datetime_split = datetime.split(' ');    
        let date = datetime_split[0].replaceAll('-', '');    
        let time = datetime_split[1].replaceAll(':', '');    
        return {"date": date, "time": time};  
    };  

    return (reactLocalStorage.get("signedIn") === 'true') ? (        
        <div>            
            <Navbar />            
            <div className="row col-12">                
                <Sidebar user={user} show={show} handleClose={handleClose} handleShow={handleShow} newAccount={newAccount} openAccount={openAccount} updatePage={updatePage} signOut={signOut}/>                
                <AccountActions makeTransfer={makeTransfer} show={radioShow} handleClose={handleRadioClose} handleShow={handleRadioShow} handleAccountRadioFalse={handleAccountRadioFalse} handleAccountRadioTrue={handleAccountRadioTrue} deposit={deposit} withdraw={withdraw}/>    
                <MyAccounts addAccountApi={addAccountApi} />
            </div>        
        </div>    
    ): (
        <div className="text-center">
            <Navbar/>
            <p>Du är utloggad! Logga in igen för att få tillgång till mina sidor</p>
        </div>
    );
}