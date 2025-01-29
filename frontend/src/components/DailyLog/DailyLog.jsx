import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GrUserWorker } from 'react-icons/gr';
import { FaPhoneAlt, FaTruck, FaEdit } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5'; // Close icon
import { DeleteOutlined } from '@ant-design/icons'; // Delete icon
import Cookies from 'js-cookie';
import debounce from 'lodash.debounce';
import 'react-time-picker/dist/TimePicker.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './DailyLog.css';

const DailyLog = (props) => {
    const { log, onUpdateLog, selectedDate } = props;
    const { log_status, start_time, ride_id, vehicle_no, driver_id } = log;

    const [clientName, setClientName] = useState("Loading...");
    const [driverName, setDriverName] = useState("Loading...");
    const [driverNumber, setDriverNumber] = useState("Loading...");
    const [vehicleType, setVehicleType] = useState(null);
    const [vehicleModel, setVehicleModel] = useState("Loading...");
    const [status, setStatus] = useState(log_status);
    const [startTime, setStartTime] = useState(() => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    });

    const [showPopup, setShowPopup] = useState(false); // State to control the popup
    const [searchTerm, setSearchTerm] = useState('');
    const [driverSearchTerm, setDriverSearchTerm] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [selectedBackupVehicle, setSelectedBackupVehicle] = useState(null); // Selected backup vehicle
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null); // Selected driver
    const navigate = useNavigate();

    const startDate = selectedDate;
    

    useEffect(() => {
        const fetchDriverName = async (id) => {
            if (driver_id) {
                try {
                    const response = await axios.get(`http://localhost:8080/get-user/${driver_id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${Cookies.get('jwt_token')}`,
                        },
                    });
                    const data = response.data;

                    const clientDetails = await axios.get(`http://localhost:8080/get-ride/${ride_id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${Cookies.get('jwt_token')}`,
                        },
                    });
                    const clientData = clientDetails.data;

                    setClientName(clientData.client_name);
                    setDriverName(data.name);
                    setDriverNumber(data.phone_no);
                } catch (error) {
                    console.error("Error fetching driver details:", error);
                    setDriverName("Driver Not Found");
                    setDriverNumber("Not Available");
                }
            }

            if (vehicle_no) {
                try {
                    const result = await axios.get(`http://localhost:8080/get-vehicle-details/${vehicle_no}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${Cookies.get('jwt_token')}`,
                        },
                    });
                    const data = result.data;
                    setVehicleType(data.vehicle_type);
                    setVehicleModel(data.vehicle_model);
                } catch (error) {
                    console.error("Error fetching vehicle type:", error);
                    setVehicleType("Vehicle Not Found");
                }
            }
        };

        const fetchBackupRideDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/get-backup-details/${ride_id}/${startDate}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
                    },
                });
                const data = response.data;
                if (data.length > 0) {
                    console.log("Backup ride details:", data);
                    console.log("Backup vehicle:", data[0].vehicle_no);
                    setSelectedBackupVehicle(data[0]);
                    setSelectedDriver(data[0]);
                }
            } catch (error) {
                console.error("Error fetching backup ride details:", error);
            }
        }

        fetchDriverName();
        fetchBackupRideDetails()
    }, [driver_id, vehicle_no, ride_id, startDate]);

    const fetchFilteredVehicles = async (query) => {
        if(!query) {
            setFilteredVehicles([]);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8080/search-vehicles?query=${query}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt_token')}`,
                },
            });
            setFilteredVehicles(response.data)
        } catch (error) {
            console.error("Error fetching filtered vehicles:", error);
        }
    }

    const fetchFilteredDrivers = async (query) => {
        if(!query) {
            setFilteredDrivers([]);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8080/search-drivers?query=${query}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt_token')}`,
                },
            });
            setFilteredDrivers(response.data)
        } catch (error) {
            console.error("Error fetching filtered drivers:", error);
        }
    }

    const debouncedFetchVehicles = debounce(fetchFilteredVehicles, 500)

    const debouncedFetchDrivers = debounce(fetchFilteredDrivers, 500)

    const handleVehiclesSearchInput = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        setSelectedBackupVehicle(null);
        debouncedFetchVehicles(query.toLowerCase());
    }

    const handleDriversSearchInput = (e) => {
        const query = e.target.value;
        setDriverSearchTerm(query);
        setSelectedDriver(null);
        debouncedFetchDrivers(query.toLowerCase());
    }

    const onStatusChange = (e) => {
        setStatus(e.target.value);
        onUpdateLog(ride_id, startTime, e.target.value);
    };

    const handleTimeChange = (e) => {
        setStartTime(e.target.value);
        onUpdateLog(ride_id, e.target.value, status);
    };

    const onAddBackup = () => {
        setShowPopup(true); // Show the popup
    };

    const closePopup = () => {
        setShowPopup(false); // Hide the popup
    };

    const selectBackupVehicle = (vehicle) => {
        setSelectedBackupVehicle(vehicle);
        setSearchTerm('')
        setFilteredVehicles([])
    };

    const selectedBackupDriver = (driver) => {
        setSelectedDriver(driver);
        console.log("Selected driver:", driver);
        setDriverSearchTerm('');
        setFilteredDrivers([]);
    }

    const onHandleBackupSubmit = (e) => {
        e.preventDefault();
        const backupData = {
            ride_id,
            date: startDate,
            vehicle_no: selectedBackupVehicle.vehicle_no,
            driver_id: selectedDriver.id,
        }
        console.log("Backup data:", backupData);
        const response = axios.post(`http://localhost:8080/add-backup`, backupData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get('jwt_token')}`,
            },
        });
        toast.promise(response, {
            pending: 'Adding backup...',
            success: 'Backup added successfully',
            error: 'Error adding backup',
        });
        
        closePopup();
    }


    const onRideDetails = () => {
        console.log('Ride details clicked');
        navigate(`/ride-details/${ride_id}/${startDate}`);
    }

    return (
        <li className="daily-log">
            <div className='client-name-edit-btn-con'>
            <h1>{clientName}</h1>
                <FaEdit color='black' onClick={onRideDetails} style={{cursor: 'pointer'}}/>
            </div>
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
            <label htmlFor="status">Update Ride Status:</label>
            <select id="status" value={status} onChange={onStatusChange}>
                <option value="present">Present</option>
                <option value="Half Day Absent">Half Day Absent</option>
                <option value="Full Day Absent">Full Day Absent</option>
                <option value="Schedule Vendor Half Day Replacement">Schedule Vendor Half Day Replacement</option>
                <option value="Schedule Vendor Full Day Replacement">Schedule Vendor Full Day Replacement</option>
            </select>
            {status === "Half Day Absent" || status === "Full Day Absent" || status.includes("Replacement") ? (
                <button type="button" onClick={onAddBackup} className="add-alternatives-button">
                    Add Backup
                </button>
            ) : null}
            <div className="ride-driver-details-container">
                <div className="ride-driver-details">
                    <label>Vehicle Details</label>
                    <div>
                        <GrUserWorker />
                        <p>{vehicle_no?.toUpperCase() || 'N/A'}</p>
                    </div>
                    <div>
                        <FaTruck />
                        <p>{vehicleModel}</p>
                    </div>
                </div>
                <div className="ride-driver-details">
                    <label>Driver Details</label>
                    <div>
                        <GrUserWorker />
                        <p>{driverName?.toUpperCase() || 'N/A'}</p>
                    </div>
                    <div>
                        <FaPhoneAlt />
                        <p>{driverNumber}</p>
                    </div>
                </div>
            </div>
            <hr />
            {selectedBackupVehicle && selectedBackupDriver && (
                <div className='backup-section'>
                    <div className='backup-header'>
                        <h3>Backup Details</h3>
                        <button type='button'><DeleteOutlined style={{ color: 'red', fontSize: '20px' }} /></button>
                    </div>
                    <p>
                        <strong>Backup Vehicle:</strong> {selectedBackupVehicle.vehicle_no} ({selectedBackupVehicle.vehicle_model})
                    </p>
                    <p>
                        <strong>Backup Driver:</strong> {selectedDriver.driver_name} ({selectedDriver.driver_phone_no})
                    </p>
                </div>
            )}
            {showPopup && (
                <div
                    className="popup-container"
                    onClick={closePopup} // Close the popup when clicking outside
                >
                    <div
                        className="popup"
                        onClick={(e) => e.stopPropagation()} // Prevent click inside the popup from closing it
                    >
                        <div className="popup-header">
                            <IoClose className="close-icon" onClick={closePopup} />
                            <div className="drag-bar"></div>
                        </div>
                        <div className="popup-content">
                            <h2>Select Backup Vehicle</h2>
                            <form className='add-backup-form' onSubmit={onHandleBackupSubmit}>
                                <input 
                                    type='search' 
                                    placeholder='Search Vehicle' 
                                    value={selectedBackupVehicle ? selectedBackupVehicle.vehicle_no : searchTerm} 
                                    onChange={handleVehiclesSearchInput}
                                    className='search-input'
                                    required/>
                                {filteredVehicles.length > 0 && (
                                    <ul className='dropdown-list'>
                                        {filteredVehicles.map(vehicle => (
                                            <li key={vehicle.vehicle_no}
                                                onClick={() => selectBackupVehicle(vehicle)}
                                                className='dropdown-item'
                                                >
                                                    {vehicle.vehicle_no} - {vehicle.vehicle_model}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {filteredVehicles.length === 0 && searchTerm && (
                                    <p className='no-results'>No Vehicles Found</p>
                                )}
                                <input 
                                type='search' 
                                placeholder='Search Driver'  
                                value={selectedDriver ? selectedDriver.name : driverSearchTerm}
                                onChange={handleDriversSearchInput}
                                className='search-input'
                                required/>
                                {filteredDrivers.length > 0 && (
                                    <ul className='dropdown-list'>
                                        {filteredDrivers.map(driver => (
                                            <li key={driver.id}
                                                onClick={() => selectedBackupDriver(driver)}
                                                className='dropdown-item'
                                                >
                                                    {driver.name} - {driver.phone_no}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {filteredDrivers.length === 0 && driverSearchTerm && (
                                    <p className='no-results'>No Drivers Found</p>
                                )}
                                <button type='submit'>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
};

export default DailyLog;