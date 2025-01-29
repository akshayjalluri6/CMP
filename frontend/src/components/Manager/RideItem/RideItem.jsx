import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './RideItem.css';

const RideItem = props => {
    const { ride } = props;
    const [startDate, setStartDate] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const { id, client_name, cost_per_day, duration, remaining_days, total_kms, ride_status } = ride; 
    const navigate = useNavigate();

    const onViewRideDetails = () => {
        navigate(`/manager/ride-details/${id}`);
    }

    const handleStartRide = async() => {
        try {
            const response = await axios.post(`http://localhost:8080/manager/add-initial-ride`, {ride_id: id, start_date: startDate}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get('jwt_token')}`,
                }
            })
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
        setShowPopup(false);
        setStartDate('');
        window.location.reload();
    }

    return(
        <li className='ride-item'>
            <div className="ride-main-content">
                <h2 className="client-name" onClick={onViewRideDetails}>{client_name}</h2>
                <div className="details-grid">
                    <div className="detail-box">
                        <span>Duration:</span>
                        <span className='duration'>{duration} days</span>
                    </div>
                    <div className="detail-box">
                        <span>Remaining:</span>
                        <span className='remaining-days'>{remaining_days} days</span>
                    </div>
                    <div className="detail-box">
                        <span>Cost/Day:</span>
                        <span className='cost-per-day'>₹{cost_per_day}</span>
                    </div>
                    <div className="detail-box">
                        <span>Total Kms:</span>
                        <span className='total-kms'>{total_kms} km</span>
                    </div>
                </div>
            </div>

            <div className="ride-status-section">
                {ride_status === 'pending' ? (
                    <>
                        <button 
                            className="start-ride-btn"
                            onClick={() => setShowPopup(true)}
                            type='button'
                        >
                            Start Ride
                        </button>
                        
                        {showPopup && (
                            <div className="popup-overlay">
                                <div className="start-ride-popup">
                                    <h3>Select Start Date</h3>
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <div className="popup-buttons">
                                        <button onClick={() => setShowPopup(false)}>
                                            Cancel
                                        </button>
                                        <button onClick={handleStartRide}>
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="status-display">
                        <label>Ride Started On:</label>
                        <div className="start-date">{ride_status}</div>
                    </div>
                )}
            </div>
        </li>
    )
}

export default RideItem