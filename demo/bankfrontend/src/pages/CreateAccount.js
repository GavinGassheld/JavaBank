import React from 'react';
import Navbar from "../components/Navbar";
import CreateAccountForm from "../components/CreateAccountForm";

export default function CreateAccount() {
    return (        
        <div>            
            <Navbar />            
            <div className="d-flex flex-row justify-content-center w-100" style={{position:"absolute", top:25+"%"}}>                
                <CreateAccountForm />            
            </div>                    
        </div>    
    );
}