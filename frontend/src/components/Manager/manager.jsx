import { useState, useEffect } from "react";
import {PlusCircleOutlined} from '@ant-design/icons'
import Home from "../Home/Home";
import axios from "axios";
import './manager.css'
import RideItem from "../RideItem/RideItem";

const Manager = () => {
    const [formData, setFormData] = useState();

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get('http://localhost:8080/get-rides', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMGFhYzlmZWMtZWU0Yi00NGM1LWI0NzQtYmE1OTUxNTE4ZWNhIiwiaWF0IjoxNzM0ODgwODA3LCJleHAiOjE3MzQ5NjcyMDd9.Z8QOfHIthHa2FsqjnW9AOzB84cmxMQvfiPfxi09xQas`
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

    return(
        <>
        <Home />
        <div className="manager-container">
            <div>
                <h1>Rides</h1>
                <button className="add-ride-button"><PlusCircleOutlined className="add-ride-icon"/> Add Ride</button>
            </div>
            <ul className="rides-list-container">
                {formData && formData.map((ride, index) => (
                    <RideItem key={index} ride={ride} />
                ))}
            </ul>
        </div>
        </>
    )
}

export default Manager