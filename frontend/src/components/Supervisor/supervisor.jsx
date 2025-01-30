import { useState, useEffect } from 'react';
import './supervisor.css';
import { PlusCircleOutlined, PoweroffOutlined } from '@ant-design/icons';
import axios from 'axios';
import DailyLog from '../DailyLog/DailyLog';
import { DatePicker } from 'antd';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Supervisor = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // For DatePicker and manual selection
    const [selectedDay, setSelectedDay] = useState('today'); // For highlighting buttons
    const [todaysPresentRidesCount, setTodaysPresentRidesCount] = useState(0);
    const [yesterdaysPresentRidesCount, setYesterdaysPresentRidesCount] = useState(0);
    const [tomorrowsPresentRidesCount, setTomorrowsPresentRidesCount] = useState(0);
    const [todaysAbsentRidesCount, setTodaysAbsentRidesCount] = useState(0);
    const [yesterdaysAbsentRidesCount, setYesterdaysAbsentRidesCount] = useState(0);
    const [tomorrowsAbsentRidesCount, setTomorrowsAbsentRidesCount] = useState(0);

    // Popup state
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [newRideData, setNewRideData] = useState({
        client_name: '',
        client_phone_no: '',
        vehicle_no: '',
        driver_name: '',
        price: '',
        date: new Date()
    })
    const [newVehicleData, setNewVehicleData] = useState({
        vehicle_no: '',
        vehicle_type: '',
        vehicle_model: ''
    }); // Form data for the popup
    const [selectedOption, setSelectedOption] = useState('0');



    // Fetch today's logs on component mount
    useEffect(() => {
        const fetchTodayRides = async () => {
            const findPresentsAndAbsents = (rides) => {
                let todaysPresent = 0;
                let todaysAbsent = 0;
                rides.forEach((ride) => {
                    if (ride.log_status === "present") {
                        todaysPresent++;
                    } else {
                        todaysAbsent++;
                    }
                });
                return [todaysPresent, todaysAbsent];
            };

            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            const url = `http://localhost:8080/get-daily-logs-by-date`;

            try {
                const response = await axios.get(`${url}?date=${formattedDate}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
                    }
                });
                const data = response.data;
                let [todaysPresent, todaysAbsent] = findPresentsAndAbsents(data);
                setTodaysPresentRidesCount(todaysPresent);
                setTodaysAbsentRidesCount(todaysAbsent);

                //Yesterday Data
                const yesterday = new Date(today.setDate(today.getDate() - 1));
                const yesterdayFormattedDate = yesterday.toISOString().split('T')[0];
                const yesterdayResponse = await axios.get(`${url}?date=${yesterdayFormattedDate}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('jwt_token')}`
                    }
                })
                const yesterdayData = yesterdayResponse.data;
                let [yesterdaysPresent, yesterdaysAbsent] = findPresentsAndAbsents(yesterdayData);
                setYesterdaysPresentRidesCount(yesterdaysPresent)
                setYesterdaysAbsentRidesCount(yesterdaysAbsent)

                //Tomorrow Data
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                const tomorrowsFormattedDate = tomorrow.toISOString().split('T')[0];
                const tomorrowResponse = await axios.get(`${url}?date=${tomorrowsFormattedDate}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('jwt_token')}`
                    }
                })
                const tomorrowData = tomorrowResponse.data;
                let [tomorrowsPresent, tomorrowsAbsent] = findPresentsAndAbsents(tomorrowData)
                setTomorrowsPresentRidesCount(tomorrowsPresent)
                setTomorrowsAbsentRidesCount(tomorrowsAbsent)

                setFormData(data); // Update state with today's logs
            } catch (error) {
                console.error('Error fetching today’s logs:', error);
            }
        };

        fetchTodayRides();
    }, []); // Empty dependency array ensures this runs only on mount

    // Fetch logs when a button (Yesterday, Today, Tomorrow) is clicked
    const onDayChange = async (day) => {
        setSelectedDay(day); // Highlight selected button
        let date = new Date();
        if (day === 'yesterday') {
            date.setDate(date.getDate() - 1);
        } else if (day === 'tomorrow') {
            date.setDate(date.getDate() + 1);
        }
        const formattedDate = date.toISOString().split('T')[0];
        fetchLogsByDate(formattedDate);
    };

    // Fetch logs when a date is selected in the DatePicker
    const onDateChange = (date, dateString) => {
        setSelectedDay(null);
        setSelectedDate(dateString);
        fetchLogsByDate(dateString);
    };

    const onChangeSelectedOption = (e) => {
        setSelectedOption(e.target.value);
    };

    // Update log
    const handleLogUpdate = async (log_id, start_time, log_status) => {
        try {
            const response = await axios.put(`http://localhost:8080/update-log/${log_id}`, {
                start_time,
                log_status,
                start_date: selectedDate
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('jwt_token')}`
                }
            });
            const updatedLog = response.data;
            console.log('Log updated:', updatedLog);
            fetchLogsByDate(selectedDate);
        } catch (error) {
            console.error('Error updating log:', error);
        }
    };

    // Fetch logs for a given date
    const fetchLogsByDate = async (formattedDate) => {
        const url = `http://localhost:8080/get-daily-logs-by-date`;
        try {
            const response = await axios.get(`${url}?date=${formattedDate}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('jwt_token')}`
                }
            });
            console.log(response.data)
            setFormData(response.data); // Update state with fetched logs
            setSelectedDate(formattedDate); // Update selected date
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    // Open the popup
    const handleAddRide = () => {
        setIsPopupVisible(true);
    };

    // Close the popup
    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setNewVehicleData({ vehicle_no: '', driver_id: '' }); // Reset form data
    };

    const handleLogout = () => {
        Cookies.remove('jwt_token');
        navigate('/login')
    }

    // Handle form submission inside the popup
    const handleSubmitNewRide = async (e) => {
        e.preventDefault();
        try {
            const { client_name, client_phone_no, vehicle_no, driver_name, price, date} = newRideData
            const formattedDate = date.toISOString().split('T')[0];
            const response = await axios.post('http://localhost:8080/supervisor/add-ride', {
                client_name,
                client_phone_no,
                vehicle_no,
                driver_name,
                price,
                date: formattedDate
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get('jwt_token')}`,
                }
            });
            console.log(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='bg-container'>
            <div className="home-container">
                <div className="home-top-container">
                    <button type='button' className="logout-button" onClick={handleLogout}>
                    <PoweroffOutlined className="logout-icon" />
                    </button>
                </div>
                <div className="attendance-dates-container">
                    <button
                        onClick={() => onDayChange('yesterday')}
                        className={`attendance-date-box ${selectedDay === 'yesterday' ? 'active' : ''}`}
                    >
                        <h1>Yesterday</h1>
                        <div className="present-absent">
                            <p><span className="present">{yesterdaysPresentRidesCount}</span> / <span className="absent">{yesterdaysAbsentRidesCount}</span></p>
                        </div>
                    </button>
                    <button
                        onClick={() => onDayChange('today')}
                        className={`attendance-date-box ${selectedDay === 'today' ? 'active' : ''}`}
                    >
                        <h1>Today</h1>
                        <div className="present-absent">
                            <p><span className="present">{todaysPresentRidesCount}</span> / <span className="absent">{todaysAbsentRidesCount}</span></p>
                        </div>
                    </button>
                    <button
                        onClick={() => onDayChange('tomorrow')}
                        className={`attendance-date-box ${selectedDay === 'tomorrow' ? 'active' : ''}`}
                    >
                        <h1>Tomorrow</h1>
                        <div className="present-absent">
                            <p><span className="present">{tomorrowsPresentRidesCount}</span> / <span className="absent">{tomorrowsAbsentRidesCount}</span></p>
                        </div>
                    </button>
                </div>
                <DatePicker onChange={onDateChange} className="date-picker" />
            </div>
            <div className='supervisor-container'>
                <div>
                    <h1>Daily Rides</h1>
                    <button type='button' className='add-ride-button' onClick={handleAddRide}>
                        <PlusCircleOutlined className='add-ride-icon' /> Add
                    </button>
                </div>
                {formData.length > 0 ? (
                    <>
                        <ul className='daily-logs-container'>
                            {formData.map((log, index) => (
                                <DailyLog key={index} log={log} selectedDate={selectedDate} onUpdateLog={handleLogUpdate} />
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>No rides found</p>
                )}
            </div>

            {/* Popup */}
            {isPopupVisible && (
        <div
        className="popup-overlay"
        onClick={(e) => {
            if (e.target.className === 'popup-overlay') {
                handleClosePopup(); // Close the popup only if clicked outside the popup-box
            }
        }}
    >
        <div className="popup-box">
            <select value={selectedOption} onChange={onChangeSelectedOption}>
                <option value="0">Add New Ride</option>
                <option value="1">Add New Vehicle</option>
            </select>
            {selectedOption === '0' ? (
                <div>
                    <form className='popup-content' onSubmit={handleSubmitNewRide}>
                        <input type='text' placeholder='Enter Client Name' name='client_name' onChange={e => { setNewRideData({ ...newRideData, client_name: e.target.value })}} />
                        <input type='text' placeholder='Enter Client Phone No' name='client_phone_no' onChange={e => { setNewRideData({ ...newRideData, client_phone_no: e.target.value })}} />
                        <input type="text" placeholder='Enter Vehicle Number' name="vehicle_number" onChange={e => { setNewRideData({ ...newRideData, vehicle_number: e.target.value })}} />
                        <input type="text" placeholder='Enter Driver Name' name="driver_name" onChange={e => { setNewRideData({ ...newRideData, driver_name: e.target.value })}} />
                        <input type='text' placeholder='Enter Price' name ='price' onChange={e => { setNewRideData({ ...newRideData, price: e.target.value })}} />
                        <button type='submit' className='submit-button'> Submit </button>
                    </form>
                </div>
            ) : (
                <div>
                    <form className='popup-content'>
                        <input type='text' placeholder='Enter Vehicle Number' name='vehicle_number' onChange={e => { setNewVehicleData({ ...newVehicleData, vehicle_number: e.target.value })}} />
                        <input type='text' placeholder='Enter Vehicle Type' name='vehicle_type' onChange={e => { setNewVehicleData({ ...newVehicleData, vehicle_type: e.target.value })}} />
                        <input type='text' placeholder='Enter Vehicle Model' name='vehicle_model' onChange={e => { setNewVehicleData({ ...newVehicleData, vehicle_model: e.target.value })}} />
                        <button type='submit' className='submit-button'> Submit </button>
                    </form>
                </div>
            )}
        </div>
    </div>
)}
        </div>
    );
};

export default Supervisor;