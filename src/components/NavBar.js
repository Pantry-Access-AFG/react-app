import {useNavigate} from "react-router-dom";
import { useState } from "react";
import {Link } from "react-router-dom";
import React from 'react';


export default function NavBar() {
    
    
    return (
    <div> 
            <ul className="flex-container">
            <li>
                <Link to="/profile">Profile</Link>
            </li>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/myrequests">My Requests</Link>
            </li>
            <li>
                <Link to="/login">Login</Link>
            </li>
            </ul>
    </div>
    )
 }