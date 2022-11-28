import React from "react";

export default function MyAccounts(props) {
    return (        
        <div id="accounts" className="col-4 border border-dark rounded p-2 flex-column" style={{display: "none"}}>            
            <div className="d-flex flex-column m-2">                
                <form>                    
                    <input id="addAccountID" className="form-control" type="number" placeholder="Kontonummer" required/>                    
                    <input id="addAccountName" className="form-control" type="text" placeholder="Namn" required/>                    
                    <button className="btn btn-primary" type="button" onClick={props.addAccountApi}>Lägg till konto</button>                
                </form>            
            </div>            
            <div id="addAccount"></div>            
            <div className="border rounded border-dark p-1 overflow-auto" style={{height:65+"vh"}}>                
                <label className="h4">Mina konton</label>                
                <hr/>                
                <div id="myAccountsList"></div>                
                <label className="h4">Andra konton</label>                
                <hr/>                
                <div id="accountsList"></div>            
            </div>        
        </div>    
    );
}