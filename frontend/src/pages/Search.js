import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json';
import "../styles.css";
import { Link } from '@mui/material';
import HotelComponent from '../components/HotelComponent';


import Navigation from '../components/Navigation';


export default function Signup() { 

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [minRating, setMinRating] = useState('');
    const [data, setData] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState('');
    
    const rootURL = config.serverRootURL;


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name);
        try {
            const response = await axios.post(`${rootURL}/search`, {
                name,
                location,
                minRating
            });

            if (response.status === 200) {
                setData(response.data);
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed.');
        }

        
    };

    return (
        <div style={{ padding: 40 }}>
    <form onSubmit={handleSubmit} style={{ display: 'grid'}}>
    <div className='container'><Navigation></Navigation></div>
    <div className='container'><h1>Search Hotels</h1></div>
    
        <div className='container' style={{ display: 'grid', gap: '1rem'}}>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
                <label htmlFor="name" style={{ fontWeight: 'bold', justifySelf: 'center' }}>Hotel Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ border: '1px solid #ccc', borderRadius: '0.25rem', padding: '0.5rem', width: '400px' }}
                />
            </div>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
                <label htmlFor="location" style={{ fontWeight: 'bold', justifySelf: 'center' }}>Location</label>
                <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ border: '1px solid #ccc', borderRadius: '0.25rem', padding: '0.5rem', width: '400px' }}
                />
            </div>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
                <label htmlFor="minRating" style={{ fontWeight: 'bold', justifySelf: 'center'  }}>Minimum Rating</label>
                <input
                    id="minRating"
                    type="text"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    style={{ border: '1px solid #ccc', borderRadius: '0.25rem', padding: '0.5rem', width: '400px' }}
                />
            </div>
        </div>
        <div className='container' style={{marginTop: '10px', marginBottom: '10px'}}>
            <button type="submit" className='button'>
                Search
            </button>
        </div>
    </form>
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '20px'}}>
        {data.map((hotel, index) => (
            <div key={index} style={{ border: '1px solid #ccc', borderRadius: '0.25rem', padding: '0.5rem' }}>
                <Link onClick={() => setSelectedHotel(hotel.hotel_name)} style={{ color: '#007bff', cursor: 'pointer' }}>
                    {hotel.hotel_name}
                </Link>
            </div>
        ))}
    </div>
    {selectedHotel && <HotelComponent hotelName={selectedHotel} handleClose={() => setSelectedHotel(null)} />}
</div>

        // <div className='container'
        //     style={{padding: 40}}>
        //     <form onSubmit={handleSubmit} style={{ display: 'grid'}}>
        //         <div>
        //         <div className='container'><Navigation></Navigation></div>
        //             <div className='container' style={{ display: 'grid', gap: '1rem'}}>
        //                 <div style={{ display: 'grid', gap: '0.5rem' }}>
        //                     <label htmlFor="name" style={{ fontWeight: 'bold', justifySelf: 'center' }}>Hotel Name</label>
        //                     <input
        //                         id="name"
        //                         type="text"
        //                         value={name}
        //                         onChange={(e) => setName(e.target.value)}
        //                         style={{ border: '1px solid #ccc', borderRadius: '0.25rem', padding: '0.5rem', width: '400px' }}
        //                     />
        //                 </div>
        //             </div>
        //             <div className='container' style={{ display: 'grid', gap: '0.5rem' }}>
        //                 <div>
        //                     <label htmlFor="location" style={{ fontWeight: 'bold', justifySelf: 'center' }}>Location</label>
        //                     <input
        //                         id="location"
        //                         type="text"
        //                         value={location}
        //                         onChange={(e) => setLocation(e.target.value)}
        //                         style={{ border: '1px solid #ccc', borderRadius: '0.25rem', padding: '0.5rem', width: '400px' }}
        //                     />
        //                 </div>
        //             </div>
        //             <div className='container'>
        //                 <div>
        //                     <label htmlFor="minRating">Specify the minimum rating of the hotel: </label>
        //                     <input
        //                         id="minRating"
        //                         type="text"
        //                         value={minRating}
        //                         onChange={(e) => setMinRating(e.target.value)}
        //                     />
        //                 </div>
        //             </div>
        //             <div className='container'>
        //                 <div>
        //                     <button type="submit" className='button'>
        //                         Search
        //                     </button>
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="column">
        //         {data.map((hotel, index) => (
        //                 <div key={index}>
        //                     <Link onClick={() => setSelectedHotel(hotel.hotel_name)}>
        //                         {hotel.hotel_name}
        //                     </Link>
        //                 </div>
        //             ))
        //         }
        //     </div>
        //     </form>
        //     {selectedHotel && <HotelComponent hotelName={selectedHotel} handleClose={() => setSelectedHotel(null)} />}
        // </div>
    );
}