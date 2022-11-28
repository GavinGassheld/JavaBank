var user;

function homePage(){
    document.getElementById('signIn').setAttribute('style', "display: none;");
}

function signIn(){
    let signin = document.getElementById("signin_username");
    console.log(`signin = ${signIn.innerText}`)
    let personal_id = document.getElementById("personal_id").value;
    let password = document.getElementById("password").value;
    console.log(`personal_id ${personal_id} and password ${password}`)
    //call backend
    var xhttp = new XMLHttpRequest();
    let response = false;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(xhttp.response);
            console.log(JSON.stringify(response));
            if (response.success) { //sign in success
                signin.innerText = "Logga ut";
                user = response;
                //redirect to mina sidor
                let url = document.URL.replace('index','myPage');
                console.log(`url: ${url}`);
                url = url.split('?')[0];
                console.log(`url after replace: ${url}`);
                url += `?id=${user.id}&name=${user.name}&assets=${user.assets}`;
                window.location.href = url;
            }
            console.log(`user: ${JSON.stringify(user)}`);
        }
    };
    xhttp.open("POST", `http://localhost:8080/signin?personalID=${personal_id}&password=${password}`, true);
    xhttp.send();
}

function setSignIn(){
    let signin = document.getElementById("signin_username");
    console.log(`signin = ${signIn.innerText}`)
    if (signin.innerText === 'Logga in'){
        document.getElementById('signIn').setAttribute("style", "position: absolute; top:25%; left:25%;");
    } else {
        console.log(signin.innerText)
        //sign out through backend
        signin.innerText = "Logga in";
    }
}

