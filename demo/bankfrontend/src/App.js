import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import MyPages from './pages/MyPages';
import CreateAccount from './pages/CreateAccount';

function App() {  
    return (    
        <div className="App">      
            <BrowserRouter>        
                <Routes>          
                    <Route path="/" element={<Home />} />          
                    <Route path="/signin" element={<SignIn />}/>          
                    <Route path="/mypages" element={<MyPages />}/>          
                    <Route path="/createaccount" element={<CreateAccount />} />        
                </Routes>      
            </BrowserRouter>    
        </div>  
    );
}
  
export default App;
