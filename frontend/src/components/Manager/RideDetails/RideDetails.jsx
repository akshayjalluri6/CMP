import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './RideDetails.css';

const ManagerRideDetails = () => {
    const {ride_id} = useParams();

    // State to store the ride details
    const [rides, setRides] = useState();

    // Fetch the ride details using axios
    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/manager/ride/${ride_id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('jwt_token')}`
                    }
                })
                console.log(response.data);
                setRides(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchRides();
    }, [ride_id])

    return (
        <div>
            <h1>Ride Details</h1>
        </div>
    )
}

export default ManagerRideDetails