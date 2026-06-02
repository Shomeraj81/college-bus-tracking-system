import React from 'react';
import './AuthCard.css';

function AuthCard() {
    return (
        <div className="signup-login-card">
            <a href="/login" className="btn">Login</a>
            <a href="/signup" className="btn">Sign Up</a>
        </div>
    );
}

export default AuthCard;