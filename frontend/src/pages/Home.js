import { useNavigate } from 'react-router-dom';
import HotelComponent from '../components/HotelComponent';
import {useState, useEffect} from 'react';
import { Link } from '@mui/material';




export default function NavigateButtons() {
    const [selectedHotel, setSelectedHotel] = useState('');
    const navigate = useNavigate();
    
    const handleNavigation = (path) => {
        navigate(path);
    };

    const hotelName = 'Belfast';

    return (
        <div className='w-screen h-screen flex flex-col items-center justify-center space-y-4'>
            <button onClick={() => handleNavigation('/page1')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 1</button>
            <button onClick={() => handleNavigation('/page2')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 2</button>
            <button onClick={() => handleNavigation('/page3')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 3</button>
            <button onClick={() => handleNavigation('/page4')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 4</button>
            <button onClick={() => handleNavigation('/page5')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 5</button>
            <button onClick={() => handleNavigation('/page6')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 6</button>
            <button onClick={() => handleNavigation('/page7')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 7</button>
            <button onClick={() => handleNavigation('/page8')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 8</button>
            <button onClick={() => handleNavigation('/page9')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 9</button>
            <button onClick={() => handleNavigation('/page10')} className='px-4 py-2 rounded-md bg-blue-500 text-white'>Go to Page 10</button>
            <Link onClick={() => setSelectedHotel(hotelName)}>
                Belfast
            </Link>
            {selectedHotel && <HotelComponent hotelName={hotelName} handleClose={() => setSelectedHotel(null)} />}
        </div>
    );
}
