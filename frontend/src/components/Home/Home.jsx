import { useState } from "react";
import {PoweroffOutlined} from '@ant-design/icons'
import {DatePicker} from 'antd'
import './Home.css'

const Home = () => {
  const [data, setData] = useState([]);

  return(
    <div className="home-container">
      <div className="home-top-container">
        <PoweroffOutlined  className="logout-icon"/>
      </div>
      <div className="attendance-dates-container">
        <div className="attendance-date-box">
          <h1>Yesterday</h1>
          <div className="present-absent">
          <p><span className="present">0</span> / <span className="absent">0</span></p>
          </div>
        </div>
        <div  className="attendance-date-box">
          <h1>Today</h1>
          <div className="present-absent">
          <p><span className="present">0</span> / <span className="absent">0</span></p>          </div>
        </div>
        <div className="attendance-date-box">
          <h1>Tomorrow</h1>
          <div className="present-absent">
          <p><span className="present">0</span> / <span className="absent">0</span></p>          </div>
        </div>
      </div>
      <DatePicker className="date-picker" />
    </div>
  )

}

export default Home