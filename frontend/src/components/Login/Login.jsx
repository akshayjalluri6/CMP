import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmitSuccess = (data) => {
        const { token } = data;
        Cookies.set('jwt_token', token, {
            expires: 30
        });
        navigate('/supervisor');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { email, password } = formData;
            const response = await axios.post(
                'http://localhost:8080/login',
                { email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.status === 200) {
                toast.success('Login successful');
                onSubmitSuccess(response.data);
            }
        } catch (error) {
            toast.error('Invalid credentials');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="brand-logo-section">
                    <img
                        src="/logo.png"
                        alt="CMP Logistics Logo"
                        className="brand-logo"
                    />
                </div>
                <h1 className="welcome-heading">Welcome to CMP Logistics</h1>
                <p className="subtext">Only Staff can login</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;