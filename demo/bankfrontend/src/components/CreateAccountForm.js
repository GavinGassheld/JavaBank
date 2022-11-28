import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';

export default function CreateAccountForm(props) {  
    async function createAccount() {    
        let personal_id = document.getElementById("personal_id_create").value;    
        let password = document.getElementById("passwordCreate").value;
        let name = document.getElementById("nameCreate").value;
        if (personal_id === "" || password === "" || name === "") {
            alert('Du måste fylla i alla fälten.');
        }    
        //call backend    
        const requestOptions = {      
            method: 'POST',      
            headers: {'Content-Type': 'application/json'},      
            body: JSON.stringify({        
                "personalID": personal_id,        
                "password": password,
                "name": name    
            })    
        };    
        const response = await fetch('http://localhost:8080/createnewaccount', requestOptions);    
        const user = await response.json();    
        if (user.success) {      
            reactLocalStorage.set("signedIn", true);      
            reactLocalStorage.setObject("user", user);      
            window.location.href = 'http://localhost:3000/mypages';    
        } else {      
            alert('Det gick inte att skapa ett konto.');    
        }  
    };     
    
    return (        
        <div id="createAccount" className="w-50 p-2 border border-primary rounded">            
            <label className="h4">Skapa användarkonto</label>            
            <form className="d-flex flex-column m-2">                
                <input id="nameCreate" className="form-control" type="text" placeholder="namn"/>                
                <br/>                
                <input id="personal_id_create" className="form-control" type="text" placeholder="personnummer"/>                
                <br/>                
                <input id="passwordCreate" className="form-control" type="password" placeholder="lösenord"/>                
                <br/>                
                <button className="btn btn-primary" type="button" onClick={createAccount}>Skapa</button>            
            </form>        
        </div>    
    );
}