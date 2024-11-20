import { useState } from "react";
import axios from "axios";

const Sample = () => {
    const [date, setDate] = useState(new Date());
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    const response = await axios.post('http://localhost:8080/supervisor/add-log', {
        "ride_id": "7135a5df-4971-4ede-ba5a-c7699ea96f17",
        "start_date": date,
        "start_time": null,
        "vehicle_no": "TS04CZ1234",
        "driver_id": "c937e35e-c238-4713-ad5c-554df6151f67",
        "vendor_id": "3b33b0d0-71e4-4a18-9993-41a7522c9f04"
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '
        }
    });

    console.log(response.data);
  };

  return (
    <div>
      <h1>Hello World</h1>
      <input 
        type="date" 
        onChange={handleDateChange} 
      />
      <button onClick={handleSubmit} type='submit'>Submit</button>
    </div>
  );
}

export default Sample
