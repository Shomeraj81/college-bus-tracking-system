import {react} from 'react'

import Logo from "../components/common/Logo/Logo.jsx";
import AuthCard from '../components/auth/Auth/AuthCard.jsx';

import '../styles/Landing_page.css'
function Landingpage() {
    return (
        <div> 
            <div className="background">
        
            </div>  
            <Logo />

            <div className="content">
                <h1>KIIT STUDENT BUS FACILITY</h1>
                <p style={{ color: '#010201' }}>Transport Management System</p>
            </div>
            <AuthCard/>
         
        </div>
        

        
    )
}


export default Landingpage