import React, { useEffect, useState } from 'react'
import './Explore.css'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";

function Explore() {

  let [recipes, setRecipes] = useState([]);
  let [search, setSearch] = useState('');
  let { register, handleSubmit } = useForm()
  let navigate = useNavigate();
  function handleFormSubmit(obj) {
    setSearch(obj.search)
  }

  function readRecipeByRecipeId(recipeObj) {
    // console.log(recipeObj)
    navigate(`/recipe/${recipeObj.recipeid}`, { state: recipeObj});
  }

  const getAllRecipes = async () => {
    let res = await axios.get('http://localhost:4000/recipe')
    setRecipes(res.data.payload)
  }

  useEffect(() => {
    getAllRecipes()
  }, [])

  function HandleDetails(proObj) {
    navigate(`/product/${proObj.title}`, { state: proObj })
  }

  return (
    <div>
      <div className='navigation'>
        <form className="form p-3 row-cols-1 frm" onChange={handleSubmit(handleFormSubmit)} onSubmit={(event) => event.preventDefault()}>
          <div class="input-group inp">
            <input type="text" className="form_input form-control" placeholder="    Search" {...register('search')} />
            <button type="submit" className='btn bg-white form_button'><img src="https://cdn-icons-png.flaticon.com/512/10905/10905219.png" alt="Search image" style={{ height: 22, width: 22 }} /></button>
          </div>
        </form>
      </div>
      <body style={{ minHeight: "80vh" }}>
        <div className="container-flow mx-auto row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 p-3 con">
          {
            recipes.filter((recip) => {
              if (search === '') {
                return recip
              }
              else {
                if (recip.title.toLowerCase().includes(search.toLowerCase())) {
                  return recip
                }
              }
            }).map((recipe) => {
              return (
                <div key={recipe.recipeid} className='p-2 d-flex'>
                  <div className="card shadow-lg p-4 w-100 cd" onClick={() => readRecipeByRecipeId(recipe)}>
                    <div className="card cardImg">
                      <img src={recipe.image} alt="" className='img mx-auto align-self-center product_image' />
                      {/* style={{ height: '100%', width: 'max-content' }} */}
                    </div>
                    <div className="card-body">
                      <h1 className="fs-5 text-center">{recipe.title}</h1>
                    </div>
                    <div>
                      <i><p>-{recipe.username}</p></i>
                    </div>
                    <div>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaRegStarHalfStroke />
                      {recipe.rating}
                    </div>
                    <br />
                    <p>{recipe.description.substring(0, 80) + "..."}</p>
                    <div style={{ fontSize: "smaller" }}>Last updated on {recipe.dateOfModification.substring(0, 10)}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </body>
    </div>
  )
}

export default Explore;