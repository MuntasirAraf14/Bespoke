import React from 'react'
import { backendURL } from '../src/config';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendURL + '/api/user/admin', {
                email,
                password
            });

            if (response.data.success) {
                setToken(response.data.token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("An error occurred during login. Please try again.");
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='max-w-md bg-white shadow-md rounded-lg px-8 py-6'>
                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>

                {/* attach submit handler here */}
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700'>Email Address</p>
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email}
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                            type="email"
                            placeholder='Enter your email'
                            required
                        />
                    </div>

                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700'>Password</p>
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password}
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                            type="password"
                            placeholder='Enter your password'
                            required
                        />
                    </div>

                    <button 
                        className='mt-2 w-full py-2 px-4 rounded-md text-white bg-gray-950'
                        type='submit'
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
