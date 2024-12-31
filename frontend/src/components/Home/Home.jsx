import { useState } from "react";
import { PoweroffOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import './Home.css';
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const onDayChange = async (day) => {
    let date = new Date();
    const url = 'http://localhost:8080/get-daily-logs-by-date';
    if (day === 'yesterday') {
      date.setDate(date.getDate() - 1);
      const formattedDate = date.toISOString().split('T')[0];
      try {
        const response = await axios.get(`${url}?date=${formattedDate}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTUzMzM5MmQtOTllMC00MzIzLTgwMmMtODFkOTY5ODBhOWUyIiwiaWF0IjoxNzM1MzYyMzE3LCJleHAiOjE3MzU0NDg3MTd9.XbLo57WEGWWQugPC2GVrYQevh2y64W17XBAgxzswaqc'
          }
        });
        setData(response.data);
        setSelectedDate(formattedDate);
      } catch (error) {
        console.error(error);
      }
    } else if (day === 'today') {
      const formattedDate = date.toISOString().split('T')[0];
      try {
        const response = await axios.get(`${url}?date=${formattedDate}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTUzMzM5MmQtOTllMC00MzIzLTgwMmMtODFkOTY5ODBhOWUyIiwiaWF0IjoxNzM1MzYyMzE3LCJleHAiOjE3MzU0NDg3MTd9.XbLo57WEGWWQugPC2GVrYQevh2y64W17XBAgxzswaqc'
          }
        });
        setData(response.data);
        setSelectedDate(formattedDate);
      } catch (error) {
        console.error(error);
      }
    } else if (day === 'tomorrow') {
      date.setDate(date.getDate() + 1);
      const formattedDate = date.toISOString().split('T')[0];
      try {
        const response = await axios.get(`${url}?date=${formattedDate}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTUzMzM5MmQtOTllMC00MzIzLTgwMmMtODFkOTY5ODBhOWUyIiwiaWF0IjoxNzM1MzYyMzE3LCJleHAiOjE3MzU0NDg3MTd9.XbLo57WEGWWQugPC2GVrYQevh2y64W17XBAgxzswaqc'
          }
        });
        setData(response.data);
        setSelectedDate(formattedDate);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="home-container">
      <div className="home-top-container">
        <PoweroffOutlined className="logout-icon" />
      </div>
      <div className="attendance-dates-container">
        <button onClick={() => onDayChange('yesterday')} className="attendance-date-box">
          <h1>Yesterday</h1>
          <div className="present-absent">
            <p><span className="present">0</span> / <span className="absent">0</span></p>
          </div>
        </button>
        <button onClick={() => onDayChange('today')} className="attendance-date-box">
          <h1>Today</h1>
          <div className="present-absent">
            <p><span className="present">0</span> / <span className="absent">0</span></p>
          </div>
        </button>
        <button onClick={() => onDayChange('tomorrow')} className="attendance-date-box">
          <h1>Tomorrow</h1>
          <div className="present-absent">
            <p><span className="present">0</span> / <span className="absent">0</span></p>
          </div>
        </button>
      </div>
    <DatePicker onChange={(date, dateString) => console.log(date, dateString)} className="date-picker" />
    </div>
  );
};

export default Home;