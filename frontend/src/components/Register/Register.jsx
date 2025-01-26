import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        phone_no: '',
        address: ''
    })

    const navigate = useNavigate();

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/register', formData);
            toast.success(response.data.message);
            navigate('/login');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="brand-logo-section">
                    <img
                        src="/logo.png"
                        alt="CMP Logistics Logo"
                        className="brand-logo"
                    />
                </div>
                <h1 className="welcome-heading">Welcome to CMP Logistics</h1>
                <p className="subtext">Only Staff can register</p>
                <form className="register-form" onSubmit={handleSubmitForm}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
                    <label htmlFor="role">Role</label>
                    <select name="role" id="role" value={formData.role} onChange={handleInputChange} required>
                        <option>Manager</option>
                        <option>Supervisor</option>
                        <option>Driver</option>
                    </select>
                    <label htmlFor="phone_no">Phone Number</label>
                    <input type="tel" id="phone_no" name="phone_no" value={formData.phone_no} onChange={handleInputChange} required />
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    )
}

export default Register