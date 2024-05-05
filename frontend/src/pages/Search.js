import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json';
import "../styles.css";
import Navigation from '../components/Navigation';


export default function Signup() { 

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [minRating, setMinRating] = useState('');
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
                //on submit I want to display the results
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed.');
        }

        
    };

    return (
        <div style={{padding: 40}}>
            <Navigation></Navigation>
            <form onSubmit={handleSubmit}>
                <div>
                    <div className='container'>
                        <div className='flex space-x-4 items-center justify-between'>
                            <label htmlFor="name" className='font-semibold'>Hotel Name: </label>
                            <input
                                id="name"
                                type="text"
                                className='outline-none bg-white rounded-md border border-slate-100 p-2'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='container'>
                        <div className='flex space-x-4 items-center justify-between'>
                            <label htmlFor="location" className='font-semibold'>Hotel Address: </label>
                            <input
                                id="location"
                                type="text"
                                className='outline-none bg-white rounded-md border border-slate-100 p-2'
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='container'>
                        <div className='flex space-x-4 items-center justify-between'>
                            <label htmlFor="minRating" className='font-semibold'>Specify the minimum rating of the hotel: </label>
                            <input
                                id="minRating"
                                type="text"
                                className='outline-none bg-white rounded-md border border-slate-100 p-2'
                                value={minRating}
                                onChange={(e) => setMinRating(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='container'>
                        <div className='w-full flex justify-center'>
                            <button type="submit" className='px-4 py-2 mt-2 rounded-md bg-indigo-500 outline-none font-bold text-white'>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}