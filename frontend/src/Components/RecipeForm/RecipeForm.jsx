import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './Form.css';
import { useSelector } from 'react-redux';

function RecipeForm() {
    let { register, handleSubmit, formState: { errors } } = useForm();
    let {loginUserStatus,errorOccurred,errMsg,currentUser}=useSelector(state=>state.useruserLoginReducer)
    const currentDate = new Date();
const isoString = currentDate.toISOString();
    async function handleFormSubmit(newUser) {
        newUser.ingredients=newUser.ingredients.split(',')
        newUser.ingredients = newUser.ingredients.map(ingredient => ingredient.trim());
        newUser.reviews=[];
        newUser.rating=4.5;
        newUser.username=currentUser.username;
        newUser.status=true;
        newUser.recipeid=Date.now().toString();
        newUser.dateOfCreation = new Date().toISOString();
        newUser.dateOfModification = new Date().toISOString();
        let res=await axios.post(`http://localhost:4000/recipe`,newUser);
       console.log(res.data.message);
    }

    return (
        <div className='container signup recipeForm'>
            <form className='w-50 mx-auto p-5 mt-5 shadow-lg Form' onSubmit={handleSubmit(handleFormSubmit)}>
                <h1 className='text-center'>RECIPE FORM</h1>
                
                <div className='w-100 text-start'>
                    <label htmlFor="title" className="form-label">TITLE </label>
                    <input type="text" id="title" className="form-control" {...register('title', { required: true })} />
                    {errors.title?.type === 'required' && <p className="text-danger">TITLE REQUIRED</p>}
                </div>
                <div className='w-100 text-start'>
                        <label htmlFor="image" className="form-label">IMAGE </label>
                        <input type="url" id="image" className="form-control" {...register('image', { required: true,})} />
                        {errors.image?.type === 'required' && <p className="text-danger">Image REQUIRED</p>}

                    </div>
                <div className='w-100 text-start'>
                    <label className="form-label">FOOD TYPE </label>
                    <div className='X'>
                    <div className="radio-container">
                        <input type="radio" id="veg" className="radio-input" value="veg" {...register('foodType', { required: true })} />
                        <label htmlFor="veg" className="radio-label">Veg</label>
                    </div>
                    <div className="radio-container">
                        <input type="radio" id="nonveg" className="radio-input" value="nonveg" {...register('foodType', { required: true })} />
                        <label htmlFor="nonveg" className="radio-label">Non-Veg</label>
                    </div>
                    <div className="radio-container">
                        <input type="radio" id="egg" className="radio-input" value="egg" {...register('foodType', { required: true })} />
                        <label htmlFor="egg" className="radio-label">Egg</label>
                    </div>      
                    </div>
                    {errors.foodType?.type === 'required' && <p className="text-danger">FOOD TYPE REQUIRED</p>}
                    
                </div>
                <div className='w-100 text-start'>
                    <label htmlFor="ingredients" className="form-label">INGREDIENTS </label>
                    <textarea id="ingredients" cols="30" rows="10" {...register('ingredients', { required: true })}></textarea>
                    {errors.ingredients?.type === 'required' && <p className="text-danger">INGREDIENTS REQUIRED</p>}
                </div>
                <div className='w-100 text-start'>
                    <label htmlFor="" className="form-label">COOK TIME</label>
                    <input type="number"  className='form-control' {...register('cookTime', { required: true})} />
                    {errors.cookTime?.type === 'required' && <p className="text-danger">COOKTIME REQUIRED</p>}
                </div>
                <div className='w-100 text-start'>
                    <label htmlFor="procedure" className="form-label">PROCEDURE </label>
                    <textarea id="procedure" cols="10" rows="10" {...register('procedure', { required: true })}></textarea>
                    {errors.procedure?.type === 'required' && <p className="text-danger">PROCEDURE REQUIRED</p>}
                </div>

                <div className='w-100 text-start'>
                    <label htmlFor="description" className="form-label">DESCRIPTION </label>
                    <textarea id="description" cols="30" rows="10" {...register('description', { required: true })}></textarea>
                    {errors.description?.type === 'required' && <p className="text-danger">DESCRIPTION REQUIRED</p>}
                </div>
                
                <br />
                <button className="btn bg-primary text-white px-5 d-block mx-auto">SUBMIT</button>
            </form>
        </div>
    )
}

export default RecipeForm;