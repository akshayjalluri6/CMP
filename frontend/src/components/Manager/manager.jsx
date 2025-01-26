import { useState, useEffect } from "react";
import {PlusCircleOutlined} from '@ant-design/icons'
import Home from "../Home/Home";
import axios from "axios";
import './manager.css'
import Cookies from "js-cookie";
import RideItem from "../RideItem/RideItem";
import {toast} from 'react-toastify'

const Manager = () => {
    const [formData, setFormData] = useState();
    const [newRideData, setNewRideData] = useState({
        client_name: '',
        duration: 0,
        cost_per_day: 0,
        total_kms: 0,
    })
    const [addRidePopup, setAddRidePopup] = useState(false);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get('http://localhost:8080/get-rides', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
                    }
                })
                setFormData(response.data);
                console.dir(response.data);
            } catch (error) {
                console.dir(error);
            }
        }

        fetchRides();
    }, [])

    const onAddRide = () => {
        setAddRidePopup(true);
    }

    const handleClosePopup = () => {
        setAddRidePopup(false);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRideData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddRideFormSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/manager/add-ride', newRideData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get('jwt_token')}`,
                }
            })
            
            toast.success(response.data);
            setNewRideData({
                client_name: '',
                duration: 0,
                cost_per_day: 0,
                total_kms: 0,
            })
            setAddRidePopup(false);
            window.location.reload();
        } catch (error) {
            console.dir(error);
        }
    }

    return(
        <>
        <Home />
        <div className="manager-container">
            <div>
                <h1>Rides</h1>
                <button className="add-ride-button" onClick={onAddRide}><PlusCircleOutlined className="add-ride-icon"/> Add Ride</button>
            </div>
            <ul className="rides-list-container">
                {formData && formData.map((ride, index) => (
                    <RideItem key={index} ride={ride} />
                ))}
            </ul>
            {addRidePopup && (
        <div
        className="popup-overlay"
        onClick={(e) => {
            if (e.target.className === 'popup-overlay') {
                handleClosePopup(); // Close the popup only if clicked outside the popup-box
            }
        }}
        >
        <div className="popup-box">
            <div className="popup-header">
                <h2>Add Ride Details</h2>
                <button onClick={handleClosePopup} className="close-popup">
                    &times;
                </button>
            </div>
            <form id="add-ride-form" onSubmit={handleAddRideFormSubmit} className="popup-content">
                <label htmlFor="client_name">Client Name:</label>
                <input
                    type="text"
                    id="client_name"
                    name="client_name"
                    value={newRideData.client_name}
                    onChange={handleInputChange}
                    required
                />
                <label htmlFor="duration">Duration:</label>
                <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={newRideData.duration}
                    onChange={handleInputChange}
                    required
                />
                <label htmlFor="cost_per_day">Cost Per Day:</label>
                <input
                    type="text"
                    id="cost_per_day"
                    name="cost_per_day"
                    value={newRideData.cost_per_day}
                    onChange={handleInputChange}
                    required
                />
                <label htmlFor="total_kms">Total Kms:</label>
                <input
                    type="text"
                    id="total_kms"
                    name="total_kms"
                    value={newRideData.total_kms}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit" className="submit-button">
                    Add Ride
                </button>
            </form>
        </div>
    </div>
)}
        </div>
        </>
    )
}

export default Manager