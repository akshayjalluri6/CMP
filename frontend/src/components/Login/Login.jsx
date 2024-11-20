import { useState } from 'react';
import {toast} from 'react-toastify'
import axios from 'axios'
import Cookies from 'js-cookie'
import {useNavigate} from 'react-router-dom'
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const onSubmitSuccess = (data) => {
        const {token} = data
        Cookies.set('jwt_token', token, {
            expires: 30
        })
        navigate('/supervisor');
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const {email, password} = formData;
            const response = await axios.post('http://localhost:8080/login', {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.status === 200){
                toast.success("Login successful");
                onSubmitSuccess(response.data)
            }
        } catch (error) {
            toast.error("Invalid credentials");
        }
    }

    return(
        <div className='login-container'>
            <h1>Login</h1>
            <p>Only Staff members can make logins here</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor='email'>Email</label>
                <input 
                name='email' 
                type='text' 
                value={formData.email} 
                onChange={handleInputChange} 
                required
                />

                <label htmlFor='password'>Password</label>
                <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                required
                />

                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login