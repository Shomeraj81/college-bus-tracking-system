import {react} from 'react'

import Logo from "../components/common/Logo/Logo.jsx";
import AuthCard from '../components/auth/Auth/AuthCard.jsx';

import '../styles/Landing_page.css'
import { Opacity } from '@mui/icons-material';
function Landingpage() {
    return (
        <div className="background">
            <div style={{ opacity: 1 }}><Logo /></div>
            

            <div className="content">
                <h1>KIIT STUDENT BUS FACILITY</h1>
                <p style={{ color: "#010201" }}>
                    Transport Management System
                </p>
            </div>

            <AuthCard />

        </div>
    );
}


export default Landingpage