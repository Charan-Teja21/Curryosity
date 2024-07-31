import React, { useEffect, useState } from 'react'
import { FaLessThanEqual, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import './Recipe.css'
import axios from 'axios'
import { FaArrowAltCircleRight } from "react-icons/fa";
import NoteContext from '../../noteContext';
import { useContext } from 'react';
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Recipe() {
  let { state } = useLocation();
  let navigate=useNavigate();
  let [stat,setStat]=useState(null);
  let {loginUserStatus,errorOccurred,errMsg,currentUser}=useSelector(state1=>state1.useruserLoginReducer)
  let { register, handleSubmit, formState: { errors } } = useForm();

  async function handleDelete()
  {
    let res =await axios.put(`http://localhost:4000/recipe/${state.recipeid}`,state);
    console.log(res.data.message);
    setStat(false);
    alert('Deleted the recipe!')
  }

  async function handleRestore()
  {
    let res=await axios.put(`http://localhost:4000/restorerecipe/${state.recipeid}`,state);
    console.log(res.data.message);
    setStat(true);
    alert('Restored the recipe!')

  }

  async function handleFormSubmit(newUser) {
    const res = await axios.post(`http://localhost:4000/review/${state.recipeid}`, newUser)
    alert('Your review posted successfully!')

  }
  useEffect(()=>{
    if(stat!==null)
    navigate('/dashboard');
  },[stat])

  return (
    <div className='container recipe pt-5'>
      <div className='row'>
        <div className='col-md-6 col-sm-12 '>
          <h1 className='he text-center col-8'>{state.title.toUpperCase()}</h1>
          {
            currentUser.username === state.username &&
                  (
                  (state.status === true) ? (
                    <button className='btn btn-danger' onClick={()=>{handleDelete()}}>delete</button>
                  ):(
                    <button className='btn btn-primary' onClick={handleRestore}>restore</button>
                  )
                  )
                
          }
          <div className='row mb-2'>
            <small className='col-6'>Created on {state.dateOfCreation.substring(0, 10)}</small>
            <small className='col-6'>Last updated on {state.dateOfModification.substring(0, 10)}</small>
          </div>
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaRegStarHalfStroke />
          <p className='d-inline ps-2'>{state.rating}</p>
          <div className='row mt-5 text-center'>
            <div className='col-6'>
              <p className='display-1' style={{ borderRight: "1px solid black" }}>{state.ingredients.length}</p>
              <small>Ingredients</small>
            </div>
            <div className='col-6'>
              <p className='display-1'>{state.cookTime}</p>
              <p>Minutes</p>
            </div>
          </div>
        </div>
        <div className='col-md-6 col-sm-12'>
          <img src={state.image} alt="" style={{ width: "90%" }} />
        </div>
      </div>

      <div>
        <h2 className='hea d-inline ps-1 pe-1'>INGREDIENTS</h2>
        {
          state.ingredients.map((ele, index) => (
            <li key={index}>{ele}</li>
          ))
        }
        <p className='mb-5'></p>
        <h2 className='hea mt-5 d-inline ps-1 pe-1'>PROCEDURE</h2>
        <p>
          {state.procedure}
        </p>
        <p className='mb-5'></p>
        <h2 className='hea mt-5 d-inline ps-1 pe-1'>DESCRIPTION</h2>
        <p>
          {state.description}
        </p>
      </div>
      {
        
        (loginUserStatus===true&&currentUser.username !== state.username) && (
          <div className='container rew'>
            <form className='w-50 p-5 mt-5 review' onSubmit={handleSubmit(handleFormSubmit)}>
              <div className='w-100 text-start'>
                <label className="form-label">RATING </label>
                <div className='stars'>
                  <div className="radio-container">
                    <input type="radio" id="1" className="radio-input" value="1" {...register('rating', { required: true })} />
                    <label htmlFor="1" className="radio-label"></label>
                  </div>
                  <div className="radio-container">
                    <input type="radio" id="2" className="radio-input" value="2" {...register('rating', { required: true })} />
                    <label htmlFor="2" className="radio-label"></label>
                  </div>
                  <div className="radio-container">
                    <input type="radio" id="3" className="radio-input" value="3" {...register('rating', { required: true })} />
                    <label htmlFor="3" className="radio-label"></label>
                  </div>
                  <div className="radio-container">
                    <input type="radio" id="4" className="radio-input " value="4" {...register('rating', { required: true })} />
                    <label htmlFor="4" className="radio-label"></label>
                  </div>
                  <div className="radio-container">
                    <input type="radio" id="5" className="radio-input" value="5" {...register('rating', { required: true })} />
                    <label htmlFor="5" className="radio-label"></label>
                  </div>
                </div>
                {errors.foodType?.type === 'required' && <p className="text-danger">RATING REQUIRED</p>}

              </div>
              <div className='w-100 text-start'>
                <label htmlFor="review" className="form-label">REVIEW </label>
                <textarea id="review textar" cols="10" rows="10" {...register('review', { required: true })}></textarea>
                {errors.review?.type === 'required' && <p className="text-danger">REVIEW REQUIRED</p>}
              </div>
              <button className="btn bg-primary text-white px-5 d-block mx-auto">SUBMIT</button>
            </form>
          </div>
        )
      }
      {
        state.reviews.length === 0 ?
          <img src="https://support.junglescout.com/hc/article_attachments/17368236344855" alt="" />
           :
            <div className='mb-3 ms-5'>
              {
                state.reviews.map((ele) => (
                  <li className='d-flex'>
                    <p>➡️  .</p>
                    {ele.rating == 5 && <div><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>}
                    {ele.rating == 4 && <div><FaStar /><FaStar /><FaStar /><FaStar /></div>}
                    {ele.rating == 3 && <div><FaStar /><FaStar /><FaStar /></div>}
                    {ele.rating == 2 && <div><FaStar /><FaStar /></div>}
                    {ele.rating == 1 && <FaStar />}
                    <p>    {ele.review}</p>
                  </li>
                ))
              }
            </div>
      }
    </div>
  )
}

export default Recipe