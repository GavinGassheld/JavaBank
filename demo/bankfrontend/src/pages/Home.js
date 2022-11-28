import React from 'react';
import Navbar from "../components/Navbar";

export default function Home() {  
    return (        
        <div>            
             <Navbar />            
             <div className="d-flex flex-column justify-content-center text-start m-1 p-1">  
                <div className="border rounded border-dark p-1">                    
                    <p>
                        Detta är en simpel bank. 
                    </p>
                    <ul>
                        <li>Frontenden är byggd i React,</li>
                        <li>Backenden i Java, med Spring RESTful webservice för att hantera databasanrop.</li>    
                    </ul>                
                    <p>
                        Det finns en del brister i projektet då jag påbörjade och avslutade det under en vecka. Exempelvis:
                    </p>
                    <ul>
                        <li>Inloggningssystemet är inte säkert</li>
                        <li>Inga tokens eller liknande är implementerade för att ge användaren tillgång till sidorna. Allt sparas bara genom en json som beskriver användarens tillstånd via <span className="fst-italic fw-bold">reactjs-localstorage</span>.</li>
                        <li>Backenden är relativt buggfri, men jag hade problem med att ladda upp json till mariaDB vilket slutade med att jag skrev kreativa, men ineffektiva, hjälpfunktioner för att omvandla mina <span className="fw-bold">String</span>s till json i backenden (något jag senare insåg att jag kunde undvikt helt, och kanske implementerar så snart jag får tid).</li>
                        <li>Några av anropen är säkra från SQL-injektioner, men inte alla. Det borde lösas.</li>
                        <li>Jag har inte gjort något snyggt sätt att hantera felmeddelanden, och de blir inte så specifika, då jag inte skickar någon speciell data från backenden.</li>
                        <li>Konton sorteras inte efter något speciellt, men transaktionsloggarna gör, med nyaste transaktionerna högst upp. Det blev jag nöjd med.</li>
                        <li>Frontenden lämnar lite att eftersträva utseendemässigt, och funktionaliteten hade kunnat förbättras på många ställen.</li>
                        <li>Jag lyckades också radera hela projektet precis när det var klart och skulle laddas upp till github. Det gjorde att jag satt en hel natt med att fiska upp trasiga filer från gits dangling nodes.</li>
                    </ul>
                </div>              
                <br/>
                <div className="border rounded border-dark p-1">                    
                    <p>
                        Via navigationsfältet där uppe kan du skapa ett konto för att få tillgång till mina sidor. Har du redan ett konto kan du logga in med personnummer och lösenord som du angav vid registrering.
                    </p>                
                </div>                
                <br/>                
                <div className="border rounded border-dark p-1">                    
                    <p>
                        På mina sidor går det att skapa nya konton, lägga till kontakter och föra pengar mellan dessa konton.
                    </p>    
                    <label>Exempel på konton att lägga till</label>            
                    <ul>
                        <li>Användare: Louise, kontonummer: 27739</li>
                        <li>Användare: Gavin, kontonummer: 88139</li>
                    </ul>
                </div>            
            </div>                    
        </div>    
    );
}