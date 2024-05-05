import { useNavigate } from 'react-router-dom';
import HotelComponent from '../components/HotelComponent';
import {useState, useEffect} from 'react';
import { Link } from '@mui/material';
import axios from 'axios'; 
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
                var response = await axios.get(`http://${config.server_host}:${config.server_port}/years`);
                const yearsArr = response.data.map((data) => data.review_year);
                setYears(yearsArr);
                console.log(yearsArr);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    const yearClick = async (year) => {
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
            <h1>Search By Month And Year</h1>
            <div>
                {years.map((year, index) => (
                    <button key={index} onClick={() => yearClick(year)}>{year}</button>
                ))}
            </div>
            <div>
                {(selectedYear) &&
                    months.map((month, index) => (
                        <button key={index} onClick={() => monthClick(month)}>{month}</button>
                    ))
                }
            </div>
            <div>
                {(selectedYear) &&
                    hotels.map((hotel, index) => (
                        <div key={index}>
                            <Link onClick={() => setSelectedHotel(hotel.hotel_name)}>
                                {hotel.hotel_name}
                            </Link>
                            <span>&nbsp;: {hotel.average_score}</span>
                        </div>
                    ))
                }
            </div>
            {selectedHotel && <HotelComponent hotelName={selectedHotel} handleClose={() => setSelectedHotel(null)} />}
        </div>
    )

}