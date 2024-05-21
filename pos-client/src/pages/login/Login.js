import React, { useState } from 'react';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { loginApi } from '../../api/auth/auth';

function LoginPage() {

    const navigate = useNavigate()

    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)

    const handelChange = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value
        })
    }

    const loginAction = async () => {
        setLoading(true)
        const data = await loginApi(loginForm);
        if (data.status) {
            localStorage.setItem('token', data.token)
            navigate('/home')
        }
        setLoading(false)
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-400 to-teal-400 justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md max-w-xs w-full flex flex-col items-center justify-start">
                <h1 className='text-[40px] font-bold text-blue-300'>POST-REPO</h1>
                <p className='mt-10 font-thin text-left w-full text-[48px] text-blue-400'>Hello,</p>
                <p className='-mt-8 mb-4 font-bold text-left w-full text-[48px] text-blue-400'>welcome!</p>
                <div className='w-full flex flex-col items-start justify-start gap-3'>
                    <Input placeholder='Username' onChange={handelChange} name='username' />
                    <Input placeholder='password' type='password' onChange={handelChange} name='password' />
                </div>
                <Button className={'mt-4'} onClick={() => loginAction()} loading={loading}>
                    Login
                </Button>
            </div>
        </div>
    );
}

export default LoginPage;
