import React from "react";
import { reactLocalStorage } from 'reactjs-localstorage';

export default function Sidebar(props) {
    
    return (        
        <div className="d-flex flex-column border rounded border-dark p-2 col-2 justify-content-between" style={{height:89+'vh'}}>            
            <div>                
            <label className="h5">{reactLocalStorage.getObject("user").name}</label>                
            <p>                    
                <button 
                    className="btn btn-link text-black" 
                    data-bs-toggle="collapse" 
                    type="button" 
                    href="#collapseAccounts"
                    aria-expanded="false" 
                    aria-controls="collapseAccounts"
                >                        
                    Konton                    
                </button>                
            </p>                
                <div className="collapse" id="collapseAccounts">                    
                    <div className="card card-body">                        
                        <button className="btn btn-link text-black" onClick={props.openAccount}>- Sparkonto</button>                        
                        <a className="text-black" href="#createAccount" data-bs-toggle="modal" data-bs-target="#addAccountModal">+ Skapa nytt konto</a>                    
                    </div>                
                </div>                
                {/* Modal */}                
                <div className="modal fade" id="addAccountModal" tabIndex="-1" aria-labelledby="addAccountModalLabel" aria-hidden="true">                    
                    <div className="modal-dialog">                        
                        <div className="modal-content">                            
                            <div className="modal-header">                                
                                <h5 className="modal-title" id="addAccountModalLabel">Lägg till konto</h5>                                
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>                            
                            </div>                            
                            <div className="modal-body">                                
                                <form id="addAccountForm">                                    
                                    <input id="accountName" className="form-control" type="text" placeholder="namn för kontot" />                                
                                </form>                            
                            </div>                            
                            <div className="modal-footer">                                
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>                                
                                <button form="addAccountForm" type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={props.newAccount}>Spara ändringar</button>                            
                            </div>                        
                        </div>                    
                    </div>                
                </div>            
            </div>            
            <button className="btn btn-link text-black" onClick={props.signOut}>Logga ut</button>        
        </div>    
    );
}