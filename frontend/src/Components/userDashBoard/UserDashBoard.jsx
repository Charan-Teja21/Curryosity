import React, { useEffect, useState } from "react";
import './UserDashBoard.css';
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch} from "react-redux";
import { updateUserImage, userLoginThunk } from "../../redux/slices/userSlice";

function UserDashBoard() {
  let navigate = useNavigate();
  let [imge, setImge] = useState(false);
  let [imgUrl, setImgUrl] = useState('');
  let { loginUserStatus, errorOccurred, errMsg, currentUser } = useSelector(state => state.useruserLoginReducer);
  let dispatch = useDispatch();
  let [recipe, setRecipe] = useState([]);
  let [deletedRecipe, setDeletedRecipe] = useState([]);

  function readRecipeByRecipeId(recipeObj) {
    navigate(`/recipe/${recipeObj.recipeid}`, { state: recipeObj });
  }

  async function getRecipeByUser() {
    const res = await axios.get(`http://localhost:4000/recipes/${currentUser.username}`);
    setRecipe(res.data.payload);
    const res1 = await axios.get(`http://localhost:4000/deletedRecipes/${currentUser.username}`);
    setDeletedRecipe(res1.data.payload);
  }

  function addRecipe() {
    navigate('/recipeform');
  }

  async function handleForm(event) {
    event.preventDefault();
    let res=await axios.put(`/updateimage/${currentUser.username}`,{imgUrl})
    currentUser.userImage=imgUrl;
    let obj={};
    obj.username=currentUser.username;
    obj.password=currentUser.password;
    dispatch(userLoginThunk(obj));
    setImge(false);
  }

  useEffect(() => {
    getRecipeByUser();
  }, []);

  useEffect(()=>{
    navigate('/dashboard');
  },[imge])

  return (
    <div className="Dashboard">
      <br /><br /><br /><br />
      <div className="row row-cols-2">
        <div className="col-8 first">
          <h1 className="userFirstName">{currentUser.firstname} {currentUser.lastname}</h1>
          <h3>Username : <span style={{ fontWeight: "bold" }}> {currentUser.username}</span> </h3>
          <h3>Years of Experience : <span style={{ fontWeight: "bold" }}>{currentUser.yexp}</span></h3>
          <h3>Email : <span style={{ fontWeight: "bold" }}>{currentUser.email}</span></h3>
          <h3>No of Recipes posted : <span style={{ fontWeight: "bold" }}>{recipe.length}</span></h3>
        </div>
        <div className="col-4">
          <div className="row row-cols-1 text-center elements">

            {(currentUser.userImage === null )? (
              <>
                <img className="userImage d-flex" src="data:image/png;base64,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" alt="" />
                {imge === false ? (
                  <>
                    <button className="btn rounded bg-primary w-50 m-2" onClick={() => setImge(true)}>ADD IMAGE</button>
                  </>
                ) : (
                    <>
                      <form onSubmit={handleForm}>
                        <div>
                          <label htmlFor="ImgUrl">Image</label>
                          <input
                            type="url"
                            name="ImgUrl"
                            className="form-control"
                            id="ImgUrl"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                            placeholder="Image Url"
                          />
                        </div>
                        <button className="btn rounded bg-primary">ADD</button>
                      </form>
                    </>
                  )}
              </>
            ) : (
                <>
                  <img className="userImage d-flex p-2" src={currentUser.userImage} alt="" />
                </>
              )}
            <button className="btn newRecipe text-center" onClick={addRecipe}>Add New Recipe</button>
          </div>
        </div>
      </div>
      <div>
        <br />
        <h2 className="head2">Posted Recipes</h2>
        <div className="container-flow mx-auto row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 p-3">
          {recipe.map((reci) => {
            return (
              <div key={reci.recipeid} className='p-2 d-flex'>
                <div className="card shadow-lg p-4 w-100 cd" onClick={() => readRecipeByRecipeId(reci)}>
                  <div className="card cardImg">
                    <img src={reci.image} alt="" className='img mx-auto align-self-center product_image' />
                  </div>
                  <div className="card-body">
                    <h1 className="fs-5 text-center">{reci.title}</h1>
                  </div>
                  <div>
                    <i><p>-{reci.username}</p></i>
                  </div>
                  <div>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStarHalfStroke />
                    {reci.rating}
                  </div>
                  <br />
                  <p>{reci.description.substring(0, 80) + "..."}</p>
                  <div style={{ fontSize: "smaller" }}>Last updated on {reci.dateOfModification.substring(0, 10)}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div>
        <br />
        <h2 className="head2">Deleted Recipes</h2>
        <div className="container-flow mx-auto row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 p-3">
          {deletedRecipe.map((reci) => {
            return (
              <div key={reci.recipeid} className='p-2 d-flex'>
                <div className="card shadow-lg p-4 w-100 cd" onClick={() => readRecipeByRecipeId(reci)}>
                  <div className="card cardImg">
                    <img src={reci.image} alt="" className='img mx-auto align-self-center product_image' />
                  </div>
                  <div className="card-body">
                    <h1 className="fs-5 text-center">{reci.title}</h1>
                  </div>
                  <div>
                    <i><p>-{reci.username}</p></i>
                  </div>
                  <div>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStarHalfStroke />
                    {reci.rating}
                  </div>
                  <br />
                  <p>{reci.description.substring(0, 80) + "..."}</p>
                  <div style={{ fontSize: "smaller" }}>Last updated on {reci.dateOfModification.substring(0, 10)}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default UserDashBoard;
