import React from 'react';
import {reactLocalStorage} from 'reactjs-localstorage'
import Navbar from "../components/Navbar";
import SignInForm from "../components/SignInForm";

export default function SignIn() {  
    return (        
        <div>            
            <Navbar />            
            <div className="d-flex flex-row justify-content-center w-100" style={{position: 'absolute', top:25+'%'}}>                
                <SignInForm/>            
            </div>                    
        </div>    
    );
}