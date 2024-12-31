import { useState, useEffect } from 'react';
import axios from 'axios';
import {GrUserWorker} from 'react-icons/gr';
import {FaPhoneAlt, FaTruck} from 'react-icons/fa'
import Cookies from 'js-cookie'
import 'react-time-picker/dist/TimePicker.css'
import './DailyLog.css';

const DailyLog = (props) => {
    const { log, onUpdateLog } = props;
    const { log_status, start_time, ride_id, vehicle_no, driver_id } = log;

    const [clientName, setClientName] = useState("Loading...");
    const [driverName, setDriverName] = useState("Loading...");
    const [driverNumber, setDriverNumber] = useState("Loading...");
    const [vehicleType, setVehicleType] = useState("Loading...");
    const [status, setStatus] = useState(log_status);

    // Initialize startTime as a string in HH:mm format
    const [startTime, setStartTime] = useState(() => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes()
        ).padStart(2, '0')}`;
    });

    useEffect(() => {
        const fetchDriverName = async () => {
            if (driver_id) {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/get-user/${driver_id}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${Cookies.get('jwt_token')}`
                            },
                        }
                    );
                    const data = response.data;

                    const clientDetails = await axios.get(`http://localhost:8080/get-ride/${ride_id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${Cookies.get('jwt_token')}`
                        }
                    })
                    const clientData = clientDetails.data

                    setClientName(clientData.client_name)
                    setDriverName(data.name);
                    setDriverNumber(data.phone_no);

                } catch (error) {
                    console.error("Error fetching driver name:", error);
                    setDriverName("Driver Not Found");
                    setDriverNumber("Not Available");
                }
            }

            if (vehicle_no) {
                try {
                    const result = await axios.get(
                        `http://localhost:8080/get-vehicle-type/${vehicle_no}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${Cookies.get('jwt_token')}`
                            },
                        }
                    );
                    const data = result.data;
                    setVehicleType(data.vehicle_type);
                } catch (error) {
                    console.error("Error fetching vehicle type:", error);
                    setVehicleType("Vehicle Not Found");
                }
            }
        };

        fetchDriverName();
    }, [driver_id, vehicle_no, ride_id]);

    const onStatusChange = (e) => {
        setStatus(e.target.value);
        onUpdateLog(ride_id, startTime, e.target.value);
    };

    const handleTimeChange = (e) => {
        setStartTime(e.target.value); // Save time in HH:mm format
        onUpdateLog(ride_id, e.target.value, status);
    };

    return (
        <div className="daily-log">
            <h1>{clientName}</h1>
            {/* Ride Client Details */}
            <div className="ride-client-details">
                <p>
                    <strong>Ride ID:</strong> {ride_id}
                </p>
                <input
                    type="time"
                    value={start_time ? start_time : startTime}
                    onChange={handleTimeChange}
                    required
                    style={{
                        padding: "5px",
                        fontSize: "13px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                    }}
                />
            </div>

            {/* Ride Status */}
            <label htmlFor="status">Update Ride Status:</label>
            <select
                id="status"
                value={status}
                onChange={onStatusChange}
            >
                <option value="present">Present</option>
                <option value="Half Day Absent">Half Day Absent</option>
                <option value="Full Day Absent">Full Day Absent</option>
                <option value="Schedule Vendor Half Day Replacement">
                    Schedule Vendor Half Day Replacement
                </option>
                <option value="Schedule Vendor Full Day Replacement">
                    Schedule Vendor Full Day Replacement
                </option>
            </select>

            {status === "Half Day Absent" ||
            status === "Full Day Absent" ||
            status === "Schedule Vendor Half Day Replacement" ||
            status === "Schedule Vendor Full Day Replacement" ? (
                <button type="button" className="add-alternatives-button">
                    Add Backup
                </button>
            ) : null}

            {/* Ride Driver Details */}
            <div className="ride-driver-details-container">
                <div
                    className="ride-driver-details"
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexDirection: "column",
                    }}
                >
                    <label htmlFor="" style={{ marginLeft: 0 }}>
                        Vehicle Details
                    </label>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                        <GrUserWorker style={{ marginLeft: 0 }} />
                        <p style={{ marginLeft: 10 }}>
                            {vehicle_no.toUpperCase()}
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                        <FaTruck style={{ marginLeft: 0 }} />
                        <p style={{ marginLeft: 10 }}>{vehicleType}</p>
                    </div>
                </div>
                <div
                    className="ride-driver-details"
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexDirection: "column",
                    }}
                >
                    <label htmlFor="" style={{ marginLeft: 0 }}>
                        Driver Details
                    </label>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                        <GrUserWorker style={{ marginLeft: 0 }} />
                        <p style={{ marginLeft: 10 }}>
                            {driverName.toUpperCase()}
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                        <FaPhoneAlt style={{ marginLeft: 0 }} />
                        <p style={{ marginLeft: 10 }}>{driverNumber}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyLog;