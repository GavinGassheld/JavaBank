const parameters = window.location.search;
const urlParams = new URLSearchParams(parameters);
console.log(urlParams);
const Name = urlParams.get('name');
var user = null;
const id = urlParams.get('id');
console.log(`id: ${id}`);
var assets = urlParams.get('assets');
if (assets === null) {
    assets = 0;
}
console.log(`asset: ${assets}`);

function signOut(){
    let signin = document.getElementById("signin_username");
    console.log(signin.innerText)
    //sign out through backend
    signin.innerText = "Logga in";
}

function openAccount() {
    let account = document.getElementById('account');
    account.setAttribute("style", "display: flex;");
    document.getElementById('accounts').setAttribute("style", "display: flex;");
    document.getElementById('assets').innerText = ` ${assets} SEK`;
    showTransactionsOtherAccounts();
}

function fillWDSelect(user) {
    let select = document.getElementById('wdSelect');
    let html = `<option selected disabled>Välj konto</option>`;
    for (let [key, value] of Object.entries(user.myAccounts)){
        html += `<option value="${key}">${value.accountName}</option>`;
    }
    select.innerHTML = html;
}

function newAccount() {
    var xhttp = new XMLHttpRequest();
    let user = false;
    let accountName = document.getElementById('accountName').value;
    console.log("newAccount")
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            user = JSON.parse(xhttp.response);
            showTransactionsOtherAccounts(user);
        }
    };
    xhttp.open("POST", `http://localhost:8080/addmyaccount?id=${id}&accountName=${accountName}`, true);
    xhttp.send();
}

function showMyAccounts(user) {
    let myAccounts = user.myAccounts;
    if (myAccounts !== null) {
        let html = "<ul>";
        for (let [key, value] of Object.entries(myAccounts)){
            let collapseId = Math.floor(Math.random() * 10000)
            html += `<li><a class="text-black text-decoration-none" data-bs-toggle="collapse" href="#collapse${collapseId}" role="button" aria-expanded="false" aria-controls="collapse${collapseId}"><span class="fw-bold">${value.accountName} : ${value.assets} SEK</span></a></li>`;
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
        html += "</ul>"
        // console.log(`html: ${html}`);
        document.getElementById('myAccountsList').innerHTML = html;
    }
}

function fillTransferOptions(user){
    let fromSelect = document.getElementById('fromSelect');
    let from_html = `<option selected disabled>Från</option>`;
    for (let [key, value] of Object.entries(user.myAccounts)){
        from_html += `<option value="${key}:${user.id}">${value.accountName}</option>`;
    }
    fromSelect.innerHTML = from_html;
    let toSelect = document.getElementById('toSelect');
    let to_html = `<option selected disabled>Till</option>`;
    for (let [key, value] of Object.entries(user.otherAccounts)){
        console.log(`key: ${key}, value ${JSON.stringify(value)}`)
        to_html += `<option value="${key}:${value.name}">${value.name}</option>`;
    }
    toSelect.innerHTML = to_html;
}

function makeTransfer() {
    let from = document.getElementById('fromSelect').value;
    let to = document.getElementById('toSelect').value;
    from = from.split(':');
    to = to.split(':');
    let fromId = from[1];
    let fromAccountId = from[0];
    let toAccountId = to[0];
    let toName = to[1];
    let datetime = getDateTime();
    let amount = document.getElementById('transferAmount').value;
    var xhttp = new XMLHttpRequest();
    let user = false;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            user = JSON.parse(xhttp.response);
            if (user.success){
                showTransactionsOtherAccounts(user);
                fillTransferOptions(user);
            } else {
                alert('Inte tillräckligt med pengar på kontot!');
            }
            
        }
    };
    xhttp.open("POST", `http://localhost:8080/maketransfer?datetime=${datetime}&fromId=${fromId}&fromAccountId=${fromAccountId}&toAccountId=${toAccountId}&toName=${toName}&amount=${amount}`, true);
    xhttp.send();
}

function showTransactionsOtherAccounts(user){
    showTransactions(user);
    showOtherAccounts(user);
    showMyAccounts(user);
    fillTransferOptions(user);
    fillWDSelect(user);
}

function showTransactionsOtherAccounts(){
    var xhttp = new XMLHttpRequest();
    let user = false;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            user = JSON.parse(xhttp.response);
            console.log("getUser() user: " + JSON.stringify(user));
            showTransactions(user);
            showOtherAccounts(user);
            showMyAccounts(user);
            fillTransferOptions(user);
            fillWDSelect(user);
        }
    };
    xhttp.open("POST", `http://localhost:8080/getuser?id=${id}`, true);
    xhttp.send();
}

function showOtherAccounts(user) {
    let otherAccounts = user.otherAccounts;
    // console.log(`otherAccounts: ${JSON.stringify(otherAccounts)}`);
    if (otherAccounts !== null) {
        let html = "<ul>";
        for (let [key, value] of Object.entries(otherAccounts)){
            let collapseId = Math.floor(Math.random() * 10000)
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
        html += "</ul>"
        // console.log(`html: ${html}`);
        document.getElementById('accountsList').innerHTML = html;
    }
}

function addAccountApi() {
    var xhttp = new XMLHttpRequest();
    let user = false;
    let accountId = document.getElementById('addAccountID').value;
    let accountName = document.getElementById('addAccountName').value;
    if (accountId === undefined || accountId === "" || accountName === undefined || accountName == "") {
        alert(`Du måste fylla i både id och namn på det mottagande kontot`);
    }
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            user = JSON.parse(xhttp.response);
            if (user.success){
                user = JSON.parse(xhttp.response);
                showOtherAccounts(user);
                return;
            }
        }
        accountId.value = "";
        accountName.value = "";
        return;
        
    };
    xhttp.open("POST", `http://localhost:8080/addaccount?id=${id}&name=${accountName}&accountId=${accountId}`, true);
    xhttp.send();
}

function addAccount(){
    html = 
    `<div class="d-flex flex-column m-2">
        <form>
            <div class="input-group">
                <input id="addAccountID" class="form-control" type="number" placeholder="kontonummer">
                <input id="addAccountName" class="form-control" type="text" placeholder="namn">
                <button class="btn btn-primary" type="button" onclick="addAccountApi()">+</button>
            </div>
        </form>
    </div>`;
    document.getElementById('addAccount').innerHTML += html;
}

function withdraw() {
    let withdraw = document.getElementById('wdAmount');
    let amount = withdraw.value;
    let accountNumber = document.getElementById('wdSelect').value;
    let datetime = getDateTime();
    var xhttp = new XMLHttpRequest();
    let user = false;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            user = JSON.parse(xhttp.response);
            console.log(JSON.stringify(user));
            assets = user.assets;
            document.getElementById('assets').innerText = assets + 'SEK';
            withdraw.value = "";
            showTransactionsOtherAccounts(user);
        }
    };
    xhttp.open("POST", `http://localhost:8080/withdraw?id=${id}&accountNumber=${accountNumber}&amount=${amount}&datetime=${datetime}`, true);
    xhttp.send();
}

function getDateTime(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return `${date} ${time}`;
}

function deposit() {
    let deposit = document.getElementById('wdAmount');
    let amount = deposit.value;
    let accountNumber = document.getElementById('wdSelect').value;
    let datetime = getDateTime();
    var xhttp = new XMLHttpRequest();
    let response = false;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(xhttp.response);
            console.log(JSON.stringify(response));
            user = response;
            assets = user.assets;
            document.getElementById('assets').innerText = assets+ 'SEK';
            deposit.value = "";
            showTransactionsOtherAccounts(user);
        }
    };
    xhttp.open("POST", `http://localhost:8080/deposit?id=${id}&amount=${amount}&accountNumber=${accountNumber}&datetime=${datetime}`, true);
    xhttp.send();
}

function showTransactions(user) {
    console.log(`show transaction - user: ${JSON.stringify(user)}`);
    let transaction_log = user.transaction_log;
    console.log(`transaction_log: ${JSON.stringify(transaction_log)}`);
    if (transaction_log !== null) {
        let html = "<ul>";
        for (let [key, value] of Object.entries(transaction_log)){
            let color_class = "";
            if (value.note === 'withdraw' || value.note === 'outgoing') {
                color_class = "bg-danger";
            } else if (value.note === 'deposit' || value.note === 'incoming') {
                color_class = "bg-success";
            } else {
                color_class = "bg-warning";
            }
            delete value['note'];
            let collapseId = Math.floor(Math.random() * 10000)
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
        html += "</ul>"
        document.getElementById('transactions').innerHTML = html;
    }
    
}