import { useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

axios.defaults.withCredentials = true

export const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/login', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            if (response.status === 200) {
                const data = response.data;
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data.message
                });
                window.location.replace("/profile")
            } 
        } catch (error) {
            console.error('Unknown error when registering user:', error);
            if (error.response && error.response.data && error.response.data.message) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message
                });
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unknown error occurred'
                });
            }
        }
    };

    return (
        <div>
            <div className='w-full sm:max-w-md p-5 mx-auto'>
                <h2 className='title'>Login</h2>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='label' htmlFor='email'>Email:</label>
                        <input
                            className="input"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="label">Password:</label>
                        <input
                            className='input'
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className='button' type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};
