import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Button } from '@mui/material';
const config = require('../config.json');

export default function Navigation() {
    const navigate = useNavigate(); 

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="container" style={{ margin: '10px' }}>
        <button onClick={() => handleNavigation('/')} className="button">
            Home
        </button>
    </div>
    <div className="container" style={{ margin: '10px' }}>
        <button onClick={() => handleNavigation('/search')} className="button">
            Search Hotel
        </button>
    </div>
    <div className="container" style={{ margin: '10px' }}>
        <button onClick={() => handleNavigation('/MonthYear')} className="button">
            Search By Month/Year
        </button>
    </div>
</div>
    );
}
