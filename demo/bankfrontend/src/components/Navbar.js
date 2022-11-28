import { reactLocalStorage } from "reactjs-localstorage";

export default function Navbar() { 
    function signOut() {
        if (reactLocalStorage.get('signedIn') === 'true'){
            reactLocalStorage.set("signedIn", false);
            reactLocalStorage.setObject("user", null);
            window.location.href = "http://localhost:3000";
        }
    }

    return (        
        <nav className="navbar navbar-expand-lg navbar-primary bg-primary">            
            <div className="container-fluid">                
                <a className="navbar-brand" href="#home">Banken</a>                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">                    
                    <span className="navbar-toggler-icon"></span>                
                </button>                
                <div className="collapse navbar-collapse" id="navbarSupportedContent">                    
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">                        
                        <li className="nav-item">                            
                            <a className="nav-link active text-black" aria-current="page" href="http://localhost:3000" >Startsida</a>                        
                        </li>                        
                        <li className="nav-item">                            
                            <a className="nav-link text-black" href="http://localhost:3000/mypages">Mina sidor</a>                        
                        </li>                        
                        <li className="nav-item">                            
                            <a id="signin_username" className="nav-link text-black" href="http://localhost:3000/signin" tabIndex="-1">Logga in</a>                        
                        </li>
                        <li className="nav-item">                            
                            <a id="signin_username" className="nav-link text-black" href="http://localhost:3000/createaccount" tabIndex="-1">Skapa konto</a>
                        </li>                    
                    </ul>                    
                    {/* <form className="d-flex">                        
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>                        
                        <button className="btn btn-outline-success" type="submit">Search</button>                    
                    </form>                 */}
                    <div className="row">
                        <button className="btn btn-link text-black" tabIndex="-1" onClick={signOut}>{(reactLocalStorage.get('signedIn') === 'true') ? "Logga ut" : "Inte inloggad"}</button>
                        <p></p>
                    </div>
                </div>            
            </div>        
        </nav>    
    );
}