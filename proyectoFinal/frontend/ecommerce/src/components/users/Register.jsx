import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        age: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'age' ? parseInt(value, 10) : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/register', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: "User registered successfully"
                });
                window.location.replace("/login")
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
                <h2 className='title'>Create account</h2>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='label' htmlFor="first_name">First name:</label>
                        <input
                            className='input'
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className='label' htmlFor="last_name">Last name:</label>
                        <input
                            className='input'
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className='label' htmlFor="email">Email:</label>
                        <input
                            className='input'
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className='label' htmlFor="age">Age:</label>
                        <input
                            className='input'
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className='label' htmlFor="password">Password:</label>
                        <input
                            className='input'
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className='button' type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};
