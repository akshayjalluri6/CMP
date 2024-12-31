import './RideItem.css';

const RideItem = props => {
    const {ride} = props
    const {client_name, cost_per_day, duration, remaining_days} = ride 

    return(
        <li className='ride-item'>
            <h1>{client_name}</h1>
            <div>
            <p>Duration: <span className='duration'>{duration}</span></p>
            <p >Remaining days: <span className='remaining-days'>{remaining_days}</span></p>
            </div>
        </li>
    )
}

export default RideItem