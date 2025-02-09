import React, { useEffect, useState } from 'react';
import { FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import './Recipe.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Recipe() {
  let { recipeid } = useParams();  // Extract recipeid from URL
  let navigate = useNavigate();
  let [recipe, setRecipe] = useState(null);
  let [stat, setStat] = useState(null);
  let { loginUserStatus, currentUser } = useSelector(state => state.useruserLoginReducer);
  let { register, handleSubmit, formState: { errors } } = useForm();

  // Fetch recipe data
  useEffect(() => {
    async function fetchRecipe() {
      try {
        let res = await axios.get(`http://localhost:4000/recipe/${recipeid}`);
        console.log(recipeid)
        setRecipe(res.data.payload);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    }
    fetchRecipe();
  }, [recipeid]);

  // Redirect after delete/restore
  useEffect(() => {
    if (stat !== null) navigate('/dashboard');
  }, [stat]);

  // Delete Recipe
  async function handleDelete() {
    await axios.put(`http://localhost:4000/recipe/${recipeid}`, recipe);
    setStat(false);
    alert('Deleted the recipe!');
  }

  // Restore Recipe
  async function handleRestore() {
    await axios.put(`http://localhost:4000/restorerecipe/${recipeid}`, recipe);
    setStat(true);
    alert('Restored the recipe!');
  }

  // Submit Review
  async function handleFormSubmit(newReview) {
    await axios.post(`http://localhost:4000/review/${recipeid}`, newReview);
    alert('Your review posted successfully!');
  }

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className='container recipe pt-5'>
      <div className='row'>
        <div className='col-md-6 col-sm-12 '>
          <h1 className='he text-center col-8'>{recipe.title.toUpperCase()}</h1>
          {
            currentUser.username === recipe.username &&
            (recipe.status ? (
              <button className='btn btn-danger' onClick={handleDelete}>Delete</button>
            ) : (
              <button className='btn btn-primary' onClick={handleRestore}>Restore</button>
            ))
          }
          <div className='row mb-2'>
            <small className='col-6'>Created on {recipe.dateOfCreation.substring(0, 10)}</small>
            <small className='col-6'>Last updated on {recipe.dateOfModification.substring(0, 10)}</small>
          </div>
          <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStarHalfStroke />
          <p className='d-inline ps-2'>{recipe.rating}</p>
          <div className='row mt-5 text-center'>
            <div className='col-6'>
              <p className='display-1' style={{ borderRight: "1px solid black" }}>{recipe.ingredients.length}</p>
              <small>Ingredients</small>
            </div>
            <div className='col-6'>
              <p className='display-1'>{recipe.cookTime}</p>
              <p>Minutes</p>
            </div>
          </div>
        </div>
        <div className='col-md-6 col-sm-12'>
          <img src={recipe.image} alt="" style={{ width: "90%" }} />
        </div>
      </div>

      <h2 className='hea d-inline ps-1 pe-1 pb-1'>INGREDIENTS</h2>
      <ul>
        {recipe.ingredients.map((ele, index) => <li key={index}>{ele}</li>)}
      </ul>

      <h2 className='hea mt-5 d-inline ps-1 pe-1'>PROCEDURE</h2>
      <p style={{paddingTop:10,paddingBottom:10}}>{recipe.procedure}</p>

      <h2 className='hea mt-5 d-inline ps-1 pe-1'>DESCRIPTION</h2>
      <p style={{paddingTop:10,paddingBottom:10}}>{recipe.description}</p>

      {loginUserStatus && currentUser.username !== recipe.username && (
        <div className='container rew'>
          <form className='w-50 p-5 mt-5 review' onSubmit={handleSubmit(handleFormSubmit)}>
            <div className='w-100 text-start'>
              <label className="form-label">RATING </label>
              <div className='stars'>
                {[1, 2, 3, 4, 5].map(num => (
                  <div className="radio-container" key={num}>
                    <input type="radio" id={num} className="radio-input" value={num} {...register('rating', { required: true })} />
                    <label htmlFor={num} className="radio-label"></label>
                  </div>
                ))}
              </div>
              {errors.rating?.type === 'required' && <p className="text-danger">RATING REQUIRED</p>}
            </div>
            <div className='w-100 text-start'>
              <label htmlFor="review" className="form-label">REVIEW </label>
              <textarea id="review textar" cols="10" rows="10" {...register('review', { required: true })}></textarea>
              {errors.review?.type === 'required' && <p className="text-danger">REVIEW REQUIRED</p>}
            </div>
            <button className="btn bg-primary text-white px-5 d-block mx-auto">SUBMIT</button>
          </form>
        </div>
      )}

      {recipe.reviews.length === 0 ? (
        <img src="https://support.junglescout.com/hc/article_attachments/17368236344855" style={{marginTop:20}} alt="No reviews yet" />
      ) : (
        <div className='mb-3 ms-5 pt-1 pb-1'>
          {recipe.reviews.map((ele, index) => (
            <li className='d-flex' key={index}>
              <p>➡️</p>
              {Array.from({ length: ele.rating }).map((_, i) => <span style={{paddingTop:1}}><FaStar key={i} /></span> )}
              <p>{ele.review}</p>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recipe; 