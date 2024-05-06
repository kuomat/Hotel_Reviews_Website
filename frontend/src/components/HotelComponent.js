import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Button } from '@mui/material';
const config = require('../config.json');

const ReviewComponent = ({ date, overall_score, service_score, cleanliness_score, value_score, location_score, sleep_quality_score, rooms_score, review}) => {
    return (
        <div style={{ paddingBottom: '15px'}}>
            <div>
                {date}
            </div>
            <div>
                Overall Score: {overall_score}
            </div>
            {(service_score && service_score.trim() !== '') &&
                <div>Service Score: {service_score}</div>
            }
            {(cleanliness_score && cleanliness_score.trim() !== '') &&
                <div>Cleanliness Score: {cleanliness_score}</div>
            }
            {(value_score && value_score.trim() !== '') &&
                <div>Value Score: {value_score}</div>
            }
            {(location_score && location_score.trim() !== '') &&
                <div>Location Score: {location_score}</div>
            }
            {(sleep_quality_score && sleep_quality_score.trim() !== '') &&
                <div>Sleep Quality Score: {sleep_quality_score}</div>
            }
            {(rooms_score && rooms_score.trim() !== '') &&
                <div>Room Score: {rooms_score}</div>
            }
            <div>{review}&nbsp;</div>
        </div>

    )
}


export default function HotelComponent({ hotelName, handleClose }) {
    const [hotelInfo, setHotelInfo] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reviewCount, setReviewsCount] = useState([]);
  
    useEffect(() => {
        const fetchData = async () => {
            let namee = hotelName;
            if (typeof hotelName !== "undefined") {
                namee = hotelName;
                // console.log(namee);
             }
            try {
                var response = await axios.get(`http://${config.server_host}:${config.server_port}/hotel/${hotelName}`);
                setHotelInfo(response.data);
                var response = await axios.get(`http://${config.server_host}:${config.server_port}/${hotelName}/avgScoresCategories`);
                setCategories(response.data[0]);      
                var response = await axios.get(`http://${config.server_host}:${config.server_port}/${hotelName}/reviews`);
                setReviewsCount(response.data[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

  
    return (
        <Modal
        open={true}
        onClose={handleClose}
        style={{ height: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', overflow: 'hidden', marginTop: '20px'}}
        >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', overflow: 'hidden', paddingTop: '50px'}}>
        <Box
            p={3}
            style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 900, overflowY: 'auto' }}
            >
            <h1>{hotelName}</h1>
            <h2>Average Overall Score: {categories.avg_overall_score}</h2>
        {(Array.isArray(hotelInfo) && hotelInfo.length > 0) && 
            <div>Address: {hotelInfo[0].address}</div>
        }
        {/* <div>Address: {hotelInfo.address}</div> */}
        {((Array.isArray(hotelInfo) && hotelInfo.length > 0) && hotelInfo[0].lat && hotelInfo[0].lng) &&
            <div>Coordinates: {hotelInfo[0].lat}, {hotelInfo[0].lng}</div>
        }
        {(categories.avg_service_score) &&
            <div>Service Score: {categories.avg_service_score}</div>
        }
        {(categories.avg_cleanliness_score) &&
            <div>Cleanliness Score: {categories.avg_cleanliness_score}</div>
        }
        {(categories.avg_value_score) &&
            <div>Value Score: {categories.avg_value_score}</div>
        }
        {(categories.avg_location_score) &&
            <div>Location Score: {categories.avg_location_score}</div>
        }
        {(categories.avg_sleep_quality_score) &&
            <div>Sleep Quality Score: {categories.avg_sleep_quality_score}</div>
        }
        {(categories.avg_rooms_score) &&
            <div>Room Score: {categories.avg_rooms_score}</div>
        }
        <div>Number of Reviews: {reviewCount.review_count}</div>
        <h2>Reviews</h2>
        <div>
            {hotelInfo.map((review, index) => (
                <ReviewComponent key={index} date={review.date} overall_score={review.overall_score} service_score={review.service_score} cleanliness_score={review.cleanliness_score} value_score={review.value_score} location_score={review.location_score} sleep_quality_score={review.sleep_quality_score} rooms_score={review.rooms_score} review={review.review}></ReviewComponent>
            )
            )}
        </div>
        </Box>
        <Button onClick={handleClose} >
          Close
        </Button>
        </div>
      </Modal>
      
    );
  }
  