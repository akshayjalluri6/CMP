import { useState, useEffect } from 'react';
import './supervisor.css';
import Home from '../Home/Home';
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const Supervisor = () => {
    const [formData, setFormData] = useState([]);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get('http://localhost:8080/get-daily-logs', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMGFhYzlmZWMtZWU0Yi00NGM1LWI0NzQtYmE1OTUxNTE4ZWNhIiwiaWF0IjoxNzM1MTA0NzM1LCJleHAiOjE3MzUxOTExMzV9.4WOIxrcQNwosVtJfmz8mdwShQnup2Tjg6u2yYuSYiaY'
                    }
                })
                const data = response.data;
                setFormData(data);
            } catch (error) {
                console.log(error)
            }
        }

        fetchRides();
    }, [])

    return (
        <>
        <Home />
        <div className='supervisor-container'>
            <div>
                <h1>Daily Rides</h1>
                <button className='add-ride-button'><PlusCircleOutlined className='add-ride-icon' /> Add Vehicle</button>
            </div>
            {formData.length > 0 ? (
                <ul className='daily-logs-container'>
                    {formData.map((log, index) => (
                        <li key={index}> {log.ride_id} </li>
                    ))}
                </ul>
            ) : (
                <p> No rides found</p>
            )}
        </div>
        </>
    )
}

export default Supervisor
