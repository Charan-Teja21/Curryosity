import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
//import { hashSync } from 'bcryptjs';
import './Register.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';


function UserRegister() {
    let { register, handleSubmit, formState: { errors } } = useForm()
    let navigate=useNavigate();
    let [err,setErr]=useState('')
    //let navigate = useNavigate();
    async function handleFormSubmit(newUser) {
        newUser.userImage=null;
        const res = await axios.post('http://localhost:4000/user', newUser)
        console.log(res)
        if(res.data.message==="User Created")
        navigate('/login')
        else{
            setErr(res.data.message);
        }
    }
    return (
        <div className='contain Register'>
            {err.length!==0&&<p className='text-danger text-center fs-3'>{err}</p>}
            <form className='mx-auto p-5 mt-5 shadow-lg Form' onSubmit={handleSubmit(handleFormSubmit)}>
                <h1 className='text-center' >REGISTER</h1>

                <div className='w-100 text-start pt-5'>
                    <label htmlFor="firstname" className="text-start">FIRST NAME </label>
                    <input type="text" className="form-control" {...register('firstname', { required: true, minLength: 4 })} />
                    {errors.firstname?.type === 'required' && <p className="text-danger">CONTENT REQUIRED</p>}
                    {errors.firstname?.type === 'minLength' && <p className="text-danger">Min length is 4</p>}

                </div>
                <div className='w-100 text-start pt-3'>
                    <label htmlFor="lastname" className="form-label">LAST NAME </label>
                    <input type="text" className="form-control" {...register('lastname', { required: true, minLength: 4 })} />
                    {errors.lastname?.type === 'required' && <p className="text-danger">CONTENT REQUIRED</p>}
                    {errors.lastname?.type === 'minLength' && <p className="text-danger">Min length is 4</p>}

                </div>

                <div className='w-100 text-start pt-3'>
                    <label htmlFor="username" className="form-label">USER NAME </label>
                    <input type="text" className="form-control" {...register('username', { required: true, minLength: 4 })} />
                    {errors.username?.type === 'required' && <p className="text-danger">CONTENT REQUIRED</p>}
                    {errors.username?.type === 'minLength' && <p className="text-danger">Min length is 4</p>}

                </div>
                <div className="w-100 text-start pt-3">
                    <label htmlFor="password" className='form-label'>PASSWORD</label>
                    <input type="password" className='form-control' {...register('password', { required: true, minLength: 5 })} />
                    {errors.password?.type === 'required' && <p className="text-danger">CONTENT REQUIRED</p>}
                    {errors.password?.type === 'minLength' && <p className="text-danger">Min-length is 5</p>}
                </div>

                <div className='w-100 text-start pt-3'>
                    <label htmlFor="email" className="form-label">EMAIL </label>
                    <input type="email" className="form-control" {...register('email', { required: true })} />
                    {errors.email?.type === 'required' && <p className="text-danger">CONTENT REQUIRED</p>}
                </div>
                <div className='w-100 text-start pt-3'>
                    <label htmlFor="" className="form-label">YEARS OF EXPERIENCE</label>
                    <input type="number" className='form-control' {...register('yexp', { required: true })} />
                    {errors.yexp?.type === 'required' && <p className="text-danger">CONTENT REQUIRED</p>}
                </div>
                <br />
                <button className="btn bn px-5 d-block mx-auto">REGISTER</button>
            </form>
            <p className="text-center lead">Already Registered!
                <Link to='/login'>Login</Link>
            </p>
        </div>

    )
}

export default UserRegister