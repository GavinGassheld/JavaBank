import React from "react";
import Modal from 'react-bootstrap/Modal';

export default function AccountActions(props) {      
    return (        
        <div id="account" className="col-6 flex-column p-2 border border-dark rounded" style={{display:"none"}}>            
            <div className="d-flex flex-row justify-content-between">                
                <div className="w-50">                    
                    <label className="h4">Dina konton</label>                    
                    <div className="d-flex flex-row">                        
                        <label className="h5">Dina tillgångar: </label>                        
                        <label id="assets" className="h5 ml-1"></label>                    
                    </div>                    
                    {/* <button className="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#transferModal">Skapa överföring</button>                     */}
                    <button className="btn btn-primary" type="button" onClick={props.handleShow}>Skapa överföring</button>
                    <Modal show={props.show} onHide={props.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Skapa överföring</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <form id="transferForm">
                                <div className="input-group">                                       
                                    <select id="fromSelect" className="form-select" aria-label="Default select example"></select>
                                    <input id="transferAmount" className="form-control" type="number" placeholder="Summa"/>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="accountRadio" onClick={props.handleAccountRadioTrue} id="myAccountRadio" defaultChecked/>
                                    <label className="form-check-label" htmlFor="myAccountRadio">
                                        Mina konton
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="accountRadio" onClick={props.handleAccountRadioFalse} id="otherAccountRadio"/>
                                    <label className="form-check-label" htmlFor="otherAccountRadio">
                                        Andra konton
                                    </label>
                                </div>                                  
                                <select id="toSelect" className="form-select" aria-label="Default select example"></select>                                        
                            </form>    
                        </Modal.Body>

                        <Modal.Footer>
                            <button className="btn btn-secondary" type="button" onClick={props.handleClose}>Close</button>
                            <button className="btn btn-primary" type="button" onClick={props.makeTransfer}>Save changes</button>
                        </Modal.Footer>
                    </Modal>
                    
                    {/* <div className="modal fade" id="transferModal" tabIndex="-1" aria-labelledby="transferModalLabel" aria-hidden="true">                        
                        <div className="modal-dialog">                            
                            <div className="modal-content">                                
                                <div className="modal-header">                                    
                                    <h5 className="modal-title" id="transferModalLabel">Skapa överföring</h5>                                    
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>                                
                                </div>                                
                                <div className="modal-body">                                    
                                    <form id="transferForm">
                                        <div className="input-group">                                       
                                            <select id="fromSelect" className="form-select" aria-label="Default select example"></select>
                                            <input id="transferAmount" className="form-control" type="number" placeholder="Summa"/>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="accountRadio" onClick={props.handleAccountRadioTrue} id="myAccountRadio" defaultChecked/>
                                            <label className="form-check-label" htmlFor="myAccountRadio">
                                                Mina konton
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="accountRadio" onClick={props.handleAccountRadioFalse} id="otherAccountRadio"/>
                                            <label className="form-check-label" htmlFor="otherAccountRadio">
                                                Andra konton
                                            </label>
                                        </div>                                  
                                        <select id="toSelect" className="form-select" aria-label="Default select example"></select>                                        
                                                                            
                                    </form>                                
                                </div>                                
                                <div className="modal-footer">                                    
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>                                    
                                    <button form="transferForm" type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={props.makeTransfer}>Överför</button>                                
                                </div>                            
                            </div>                       
                        </div>                    
                    </div>             */}   
                </div>
                <form className="d-flex flex-column m-2 w-50">                                        
                    <div className="input-group">                        
                        <select id="wdSelect" className="form-select"></select>                        
                        <input id="wdAmount" className="form-control" type="number" placeholder="Summa"/>                    
                    </div>                    
                    <div className="d-flex flex-row justify-content-between">                        
                        <button className="btn btn-primary" type="button" onClick={props.deposit}>Sätt in</button>                        
                        <button className="btn btn-primary" type="button" onClick={props.withdraw}>Ta ut</button>                    
                    </div>                
                </form>            
            </div>            
            <hr/>            
            <div className="border rounded border-dark p-1 overflow-auto" style={{height:65+"vh"}}>                
                <label className="h4">Tidigare transaktioner</label>                
                <hr/>                
                <div id="transactions" className="column m-2"></div>            
            </div>                    
        </div>    
    );
}