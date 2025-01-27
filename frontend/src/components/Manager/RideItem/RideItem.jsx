import { useNavigate } from 'react-router-dom';
import './RideItem.css';

const RideItem = props => {
    const {ride} = props
    const {id, client_name, cost_per_day, duration, remaining_days, total_kms, ride_status} = ride; 
    const navigate = useNavigate();

    const onViewRideDetails = () => {
        console.log('View ride details clicked');
        navigate(`/manager/ride-details/${id}`);
    }

    return(
        <li className='ride-item' onClick={onViewRideDetails}>
            <h1>{client_name}</h1>
            <div>
            <p>Duration: <span className='duration'>{duration}</span></p>
            <p >Remaining days: <span className='remaining-days'>{remaining_days}</span></p>
            <p>Cost per day: <span className='cost-per-day'>{cost_per_day}</span></p>
            <p>Total Kms: <span className='total-kms'>{total_kms}</span></p>
            </div>
            {ride_status === 'pending' ? (
                <button type='button'>Start Ride</button>
            ) : (
                <>
                <label htmlFor='ride-status'>Ride Started On:</label>
                <input type='text' id='ride-status' value={ride_status} readOnly/>
                </>
            )}
        </li>
    )
}

export default RideItem