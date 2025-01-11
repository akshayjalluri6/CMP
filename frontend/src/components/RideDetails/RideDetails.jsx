import { useParams } from 'react-router-dom';
import './RideDetails.css';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

const RideDetails = () => {
    const { ride_id, date } = useParams();

    // Single state object to manage all form fields
    const [formData, setFormData] = useState({
        vehicle_no: "",
        partner_name: "",
        partner_number: "",
        client_name: "",
        driver_pricing: "",
        client_supervisor_name: "",
        client_supervisor_contact: "",
        vehicle_type: "",
        vehicle_body_type: "",
        vehicle_attributes: "",
        driver_name: "",
        driver_contact_number: "",
        trip_type: "Single Point",
        is_24hr_trip: "No",
        total_distance: "",
        total_time: "",
    });

    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/ride-details/${ride_id}/${date}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('jwt_token')}`
                    }
                });
                const data = response.data;

                if (data[0]) {
                    setFormData({
                        vehicle_no: data[0].vehicle_no || "",
                        partner_name: data[0].partner_name || "",
                        partner_number: data[0].partner_number || "",
                        client_name: data[0].client_name || "",
                        driver_pricing: data[0].driver_pricing || "",
                        client_supervisor_name: data[0].client_supervisor_name || "",
                        client_supervisor_contact: data[0].client_supervisor_contact || "",
                        vehicle_type: data[0].vehicle_type || "",
                        vehicle_body_type: data[0].vehicle_body_type || "",
                        vehicle_attributes: data[0].vehicle_attributes || "",
                        driver_name: data[0].driver_name || "",
                        driver_contact_number: data[0].driver_contact_number || "",
                        trip_type: data[0].trip_type || "Single Point",
                        is_24hr_trip: data[0].is_24hr_trip || "No",
                        total_distance: data[0].total_distance || "",
                        total_time: data[0].total_time || "",
                    });
                }
            } catch (error) {
                toast.error(`Error fetching ride details: ${error.message}`);
            }
        };

        fetchRideDetails();
    }, [ride_id, date]);

    // Generic handler for form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onUpdateRideDetails = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:8080/update-ride/${ride_id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('jwt_token')}`
                }
            });

            toast.success("Ride details updated successfully!");
        } catch (error) {
            toast.error(`Error updating ride details: ${error.message}`);
        }
    };

    return (
        <div className='ride-details-container'>
            <h1>Ride Details</h1>
            <div className='ride-details-fixed'>
                <div>
                    <label className='ride-details-label-fixed' htmlFor='Ride ID'>Ride ID:</label>
                    <input className='ride-details-input-fixed' value={ride_id} id='Ride ID' readOnly />
                </div>
                <div>
                    <label className='ride-details-label-fixed' htmlFor='Date'>Date:</label>
                    <input className='ride-details-input-fixed' value={date} id='Date' readOnly />
                </div>
            </div>
            <form className='ride-details-card' onSubmit={onUpdateRideDetails}>
                <label className='ride-details-label' htmlFor='vehicle_no'>Select Vehicle</label>
                <input
                    className='ride-details-input'
                    name='vehicle_no'
                    value={formData.vehicle_no}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='partner_name'>Partner Name</label>
                <input
                    className='ride-details-input'
                    name='partner_name'
                    value={formData.partner_name}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='partner_number'>Partner Number</label>
                <input
                    className='ride-details-input'
                    name='partner_number'
                    value={formData.partner_number}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='client_name'>Client Name</label>
                <input
                    className='ride-details-input'
                    name='client_name'
                    value={formData.client_name}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='driver_pricing'>Driver Pricing</label>
                <input
                    className='ride-details-input'
                    name='driver_pricing'
                    value={formData.driver_pricing}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='client_supervisor_name'>Client Supervisor Name</label>
                <input
                    className='ride-details-input'
                    name='client_supervisor_name'
                    value={formData.client_supervisor_name}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='client_supervisor_contact'>Client Supervisor Contact</label>
                <input
                    className='ride-details-input'
                    name='client_supervisor_contact'
                    value={formData.client_supervisor_contact}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='vehicle_type'>Vehicle Type</label>
                <input
                    className='ride-details-input'
                    name='vehicle_type'
                    value={formData.vehicle_type}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='vehicle_body_type'>Vehicle Body Type</label>
                <input
                    className='ride-details-input'
                    name='vehicle_body_type'
                    value={formData.vehicle_body_type}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='vehicle_attributes'>Vehicle Attributes</label>
                <input
                    className='ride-details-input'
                    name='vehicle_attributes'
                    value={formData.vehicle_attributes}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='driver_name'>Driver Name</label>
                <input
                    className='ride-details-input'
                    name='driver_name'
                    value={formData.driver_name}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='driver_contact_number'>Driver Contact Number</label>
                <input
                    className='ride-details-input'
                    name='driver_contact_number'
                    value={formData.driver_contact_number}
                    onChange={handleChange}
                />
                <label className='ride-details-label'>Trip Type</label>
                <div className='trip-type-options'>
                    <label>
                        <input
                            type='radio'
                            name='trip_type'
                            value='Single Point'
                            checked={formData.trip_type === 'Single Point'}
                            onChange={handleChange}
                        />
                        Single Point
                    </label>
                    <label>
                        <input
                            type='radio'
                            name='trip_type'
                            value='Multiple Point'
                            checked={formData.trip_type === 'Multiple Point'}
                            onChange={handleChange}
                        />
                        Multiple Point
                    </label>
                </div>
                <label className='ride-details-label'>24hr Trip</label>
                <div className='trip-type-options'>
                    <label>
                        <input
                            type='radio'
                            name='is_24hr_trip'
                            value='Yes'
                            checked={formData.is_24hr_trip === 'Yes'}
                            onChange={handleChange}
                        />
                        Yes
                    </label>
                    <label>
                        <input
                            type='radio'
                            name='is_24hr_trip'
                            value='No'
                            checked={formData.is_24hr_trip === 'No'}
                            onChange={handleChange}
                        />
                        No
                    </label>
                </div>
                <label className='ride-details-label' htmlFor='total_distance'>Total Distance (Kms)</label>
                <input
                    className='ride-details-input'
                    type='text'
                    name='total_distance'
                    value={formData.total_distance}
                    onChange={handleChange}
                />
                <label className='ride-details-label' htmlFor='total_time'>Total Time (Hours)</label>
                <input
                    className='ride-details-input'
                    type='text'
                    name='total_time'
                    value={formData.total_time}
                    onChange={handleChange}
                />
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};

export default RideDetails;
