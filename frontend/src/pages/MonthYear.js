import { useNavigate } from 'react-router-dom';
import HotelComponent from '../components/HotelComponent';
import {useState, useEffect} from 'react';
import { Link } from '@mui/material';
import axios from 'axios'; 
import Navigation from '../components/Navigation';
const config = require('../config.json');


export default function MonthYear() {
    const [selectedHotel, setSelectedHotel] = useState('');
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [years, setYears] = useState([]);
    const [hotels, setHotels] = useState([]);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // var response = await axios.get(`http://${config.server_host}:${config.server_port}/years`);
                // const yearsArr = response.data.map((data) => data.review_year);
                setYears([2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2015, 2016, 2017]);
                // console.log(yearsArr);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    const yearClick = async (year) => {
        setSelectedMonth(null);
        setSelectedYear(year);
        var response = await axios.get(`http://${config.server_host}:${config.server_port}/tophotels/${year}`);
        const hotelsArr = response.data;
        setHotels(hotelsArr);
    }

    const monthClick = async (month) => {
        const monthNum = months.indexOf(month) + 1;
        setSelectedMonth(monthNum);
        var response = await axios.get(`http://${config.server_host}:${config.server_port}/avgScoresMonth/${selectedYear}/${monthNum}`);
        const hotelsArr = response.data;
        setHotels(hotelsArr);
    }

    return (
        <div style={{padding: 40}}>
            <Navigation></Navigation>
            <div className='container'><h1>Search By Month And Year</h1></div>
            <div className="container">
                {years.map((year, index) => (
                    <button style={{ marginRight: '10px' }} className="button" key={index} onClick={() => yearClick(year)}>{year}</button>
                ))}
            </div>
            <div className="container" style={{ marginTop: '10px'}}>
                {(selectedYear) &&
                    months.map((month, index) => (
                        <button style={{ marginRight: '10px' }} className="button" key={index} onClick={() => monthClick(month)}>{month}</button>
                    ))
                }
            </div>
            <div className='container'><div style={{fontSize: '1.5em', fontWeight: 'bold', marginTop: '20px'}}>
                Selected Year: {selectedYear}
            </div></div>
            <div className='container'><div style={{fontSize: '1.5em', fontWeight: 'bold', marginTop: '10px', marginBottom: '20px'}}>
                Selected Month: {months[selectedMonth-1]}
            </div></div>
            <div className='container'>
                <div className='column'>
                    <div className="header">Hotel Name</div>
                    {(selectedYear) &&
                        hotels.map((hotel, index) => (
                            <div key={index}>
                                <Link onClick={() => setSelectedHotel(hotel.hotel_name)}>
                                    {hotel.hotel_name}
                                </Link>
                            </div>
                        ))
                    }
                </div>
                <div className="column">
                    <div className="header">Average Score</div>
                    {hotels.map((item, index) => (
                        <div key={index}>{item.average_score}</div>
                    ))}
                </div>
            </div>
            {selectedHotel && <HotelComponent hotelName={selectedHotel} handleClose={() => setSelectedHotel(null)} />}
        </div>
    )

}