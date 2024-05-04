import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config.json';

export default function HomePage() {
    const navigate = useNavigate();
    const [distribution, setDistribution] = useState([]);
    const [mostImproved, setMostImproved] = useState([]);
    const [reviews, setReviews] = useState([]);
    const rootURL = config.serverRootURL;
    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const fetchDataDistribution = async () => {//Route 10
            try {
                const response = await axios.get(`${rootURL}/reviewDistribution`);
                setDistribution(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataMostImproved = async () => {//Route 9
            try {
                const response = await axios.get(`${rootURL}/mostImproved`);
                setMostImproved(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataHotelReviews = async () => {//Route 7
            try {
                const response = await axios.get(`${rootURL}/reviews`);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        // const fetchDataDistribution = async () => {//Route 4
        //     try {
        //         const response = await axios.get(`${rootURL}/reviewDistribution/${}`);
        //         setDistribution(response.data);
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //     }
        // };

        fetchDataDistribution();
        fetchDataMostImproved();
        fetchDataHotelReviews();
    }, []);

    return (
        <div className='w-screen h-screen flex flex-col items-center justify-center space-y-4'>
            <button onClick={() => handleNavigation('/page1')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 1</button>
            <button onClick={() => handleNavigation('/page2')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 2</button>

            {/* <button onClick={() => handleNavigation('/page3')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 3</button>
            <button onClick={() => handleNavigation('/page4')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 4</button>
            <button onClick={() => handleNavigation('/page5')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 5</button>
            <button onClick={() => handleNavigation('/page6')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 6</button>
            <button onClick={() => handleNavigation('/page7')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 7</button>
            <button onClick={() => handleNavigation('/page8')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 8</button>
            <button onClick={() => handleNavigation('/page9')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 9</button>
            <button onClick={() => handleNavigation('/page10')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 10</button> */}
        </div>
    );
}
