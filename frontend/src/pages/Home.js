import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json';
import "../styles.css";
import HotelComponent from '../components/HotelComponent';
import { Link } from '@mui/material';



export default function HomePage() {
    const [selectedHotel, setSelectedHotel] = useState('');
    const navigate = useNavigate();
    const [distribution, setDistribution] = useState([]);
    const [mostImproved, setMostImproved] = useState([]);
    const [numReviews, setNumReviews] = useState([]);
    const [review, setReview] = useState([]);
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
        <div className='w-screen h-screen flex flex-col items-center justify-center space-y-4'>
            <div className="container"><button onClick={() => handleNavigation('/search')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Search Hotel</button></div>
            <div className="container"><button onClick={() => handleNavigation('/page2')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 2</button></div>
            <div className="flex">
                <div className="container"><h2>Distribution</h2></div>
                <div className="container">
                    
                    <div className="column">
                        <div className="header">Overall Score</div>
                        {distribution.map((item, index) => (
                            <div key={index}>{item.overall_score}</div>
                        ))}
                    </div>
                    <div className="column">
                        <div className="header">Number of Reviews</div>
                        {distribution.map((item, index) => (
                            <div key={index}>{item.number_of_reviews}</div>
                        ))}
                    </div>
                </div>
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
                <div className="container"><h2>Number of Reviews</h2></div>
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
                <div className="container"><h2>Hotel Reviews</h2></div>
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
            </div>    
            {selectedHotel && <HotelComponent hotelName={selectedHotel} handleClose={() => setSelectedHotel(null)} />}
        </div>
        
        
        
    );
}
