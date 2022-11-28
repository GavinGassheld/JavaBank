import React from 'react';
import {reactLocalStorage} from 'reactjs-localstorage';

export default function SignInForm() { 
    async function signIn() {    
        let personal_id = document.getElementById("personal_id_signin").value;    
        let password = document.getElementById("passwordSignIn").value;    
        //call backend    
        const requestOptions = {      
            method: 'POST',      
            headers: {'Content-Type': 'application/json'},      
            body: JSON.stringify({        
                "personalID": personal_id,        
                "password": password      
            })    
        };    
        const response = await fetch('http://localhost:8080/signin', requestOptions);    
        const user = await response.json();    
        if (user.success) {      
            reactLocalStorage.set("signedIn",true);      
            reactLocalStorage.setObject("user", user);      
            window.location.href = 'http://localhost:3000/mypages';    
        } else {      
            alert('Fel personnummer eller lösenord!');    
        }  
    }; 
    if (reactLocalStorage.get("signedIn") === 'true') {      
        alert('Du är redan inloggad. Skickar vidare till mina sidor');      
        window.location.href = "http://localhost:3000/mypages";    
    }

    
    return (        
        <div id="signIn" className={`w-50 p-2 border border-primary rounded`}>            
            <label className="h4">Logga in</label>            
            <form className="d-flex flex-column m-2">                
                <input id="personal_id_signin" className="form-control" type="text" placeholder="personnummer"/>                
                <br/>                
                <input id="passwordSignIn" className="form-control" type="password" placeholder="lösenord"/>                
                <br/>                
                <button className="btn btn-primary" type="button" onClick={signIn}>Logga in</button>            
            </form>        
        </div>    
    );
}