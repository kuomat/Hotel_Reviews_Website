import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json';
import "../styles.css";
import HotelComponent from '../components/HotelComponent';
import Navigation from '../components/Navigation';

import { Link } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';




export default function HomePage() {
    const [selectedHotel, setSelectedHotel] = useState('');
    const navigate = useNavigate();
    const [distribution, setDistribution] = useState([]);
    const [mostImproved, setMostImproved] = useState([]);
    const [numReviews, setNumReviews] = useState([]);
    const [review, setReview] = useState([]);
    const rootURL = config.serverRootURL;

    // const handleNavigation = (path) => {
    //     navigate(path);
    // };

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
        const fetchDataHotelNumReviews = async () => {//Route 4
            try {
                const response = await axios.get(`${rootURL}/hotelsScore`);
                setNumReviews(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataHotelReview = async () => {//Route 2
            try {
                const response = await axios.get(`${rootURL}/bestCategHotel`);
                setReview(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchDataDistribution();
        fetchDataMostImproved();
        fetchDataHotelNumReviews();
        fetchDataHotelReview();
    }, [rootURL]);

    return (
        <div style={{padding: 40}}>
            <Navigation></Navigation>
            <div className='container'>
                <h1>Home</h1>
            </div>
            {/* <div className="container"><button onClick={() => handleNavigation('/search')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Search Hotel</button></div>
            <div className="container"><button onClick={() => handleNavigation('/MonthYear')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Search By Month/Year</button></div> */}
            <div className="flex">
                <div className="container"><h2>Most Improved</h2></div>
                <div className="container">
                    <div className="column">
                        <div className="header">Hotel Name</div>
                        {mostImproved.map((item, index) => (
                            <div key={index}>{
                                <Link onClick={() => setSelectedHotel(item.hotel_name)}>
                                    {item.hotel_name}
                                </Link>}
                            </div>
                        ))}
                    </div>
                    {/* <div className="column">
                        <div className="header">Service Score</div>
                        {mostImproved.map((item, index) => (
                            <div key={index}>{item.detail}</div>
                        ))}
                    </div>
                    <div className="column">
                        <div className="header">More Info</div>
                        {mostImproved.map((item, index) => (
                            <div key={index}>{item.info}</div>
                        ))}
                    </div> */}
                </div>
                <div style={{marginTop: '10px'}} className="container"><h2>Most Reviewed</h2></div>
                <div className="container">
                    <div className="column">
                        <div className="header">Hotel Name</div>
                        {numReviews.map((item, index) => (
                            <div key={index}>{
                                <Link onClick={() => setSelectedHotel(item.hotel_name)}>
                                    {item.hotel_name}
                                </Link>}
                            </div>
                        ))}
                    </div>
                    <div className="column">
                        <div className="header">Review Count</div>
                        {numReviews.map((item, index) => (
                            <div key={index}>{item.review_count}</div>
                        ))}
                    </div>
                </div>
                <div style={{marginTop: '10px'}} className="container"><h2>Top Hotels</h2></div>
                <div className="container">
                    <div className="column">
                        <div className="header">Category</div>
                        {review.map((item, index) => (
                            <div key={index}>{item.category}</div>
                        ))}
                    </div>
                    <div className="column">
                        <div className="header">Hotel Name</div>
                        {review.map((item, index) => (
                            <div key={index}>{
                                <Link onClick={() => setSelectedHotel(item.hotel_name)}>
                                    {item.hotel_name}
                                </Link>}
                            </div>
                        ))}
                    </div>
                    <div className="column">
                        <div className="header">Average Score</div>
                        {review.map((item, index) => (
                            <div key={index}>{item.avg_score}</div>
                        ))}
                    </div>
                </div>
                <div style={{marginTop: '10px'}} className="container"><h2>Review Distribution</h2></div>
                <div className="container">
                    <ResponsiveContainer height={400}>
                        <BarChart
                            data={distribution}
                            layout='horizontal'
                            margin={{ left: 40 }}
                        >
                            <YAxis type='number' domain={[0, 1]} tickCount={10}/>
                            <XAxis type='category' dataKey='overall_score' />
                            <Bar dataKey='number_of_reviews' stroke='#8884d8' fill='#8884d8' />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>    
            {selectedHotel && <HotelComponent hotelName={selectedHotel} handleClose={() => setSelectedHotel(null)} />}
        </div>
        
        
        
    );
}
