import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config.json';

function DataDisplay() {
    const [items, setItems] = useState([]);
    const rootURL = config.serverRootURL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.yourservice.com/data');
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            {items.map((item, index) => (
                <div key={index} className="column">
                    <div>Name: {item.name}</div>
                    <div>Detail: {item.detail}</div>
                    <div>More Info: {item.info}</div>
                </div>
            ))}
        </div>
    );
}

export default DataDisplay;
