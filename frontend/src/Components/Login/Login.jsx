// login.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginThunk } from '../../redux/slices/userSlice';

function Login() {
  let { loginUserStatus, errorOccurred, errMsg } = useSelector(state => state.useruserLoginReducer);
  let dispatch = useDispatch();
  let { register, handleSubmit, formState: { errors } } = useForm();
  let navigate = useNavigate();

  function handleFormSubmit(userObj) {
    console.log(userObj);
    dispatch(userLoginThunk(userObj));
    alert('Login SuccessFul!')
  }

  useEffect(() => {
    if (loginUserStatus === true) {
      navigate('/dashboard');
    }
  }, [loginUserStatus, navigate]);

  return (
    <div className='container lg'>
      <div className='d-flex justify-content-center align-items-center'>
        <form className=' mx-auto p-5 mt-5 Form shadow-lg ' onSubmit={handleSubmit(handleFormSubmit)}>
          <h1 className='text-center'>LOGIN</h1>
          <div className='w-100 text-start'>
            <label htmlFor="Username" className="form-label">USER NAME </label>
            <input type="text" id="Username" className="form-control" {...register('username', { required: true, minLength: 4 })} />
            {errors.username?.type === 'required' && <p className="text-danger">CONTENT REQUIRED</p>}
            {errors.username?.type === 'minLength' && <p className="text-danger">Min length is 4</p>}
          </div>
          <div className='w-100 text-start pt-2'>
            <label htmlFor="password" className="form-label">PASSWORD </label>
            <input type='password' id="password" className="form-control" {...register('password', { required: true, minLength: 4 })} />
            {errors.password?.type === 'required' && <p className="text-danger">CONTENT REQUIRED</p>}
            {errors.password?.type === 'minLength' && <p className="text-danger">Min length is 4</p>}
          </div>
          {errorOccurred && <p className="text-danger">{errMsg}</p>}
          <button className="btn d-block bn mt-2 mx-auto ">LOGIN</button>
        </form>
      </div>
      <p className="text-center lead">
        Not yet Registered!
        <Link to='/register'>Register</Link>
      </p>
    </div>
  );
}

export default Login;
