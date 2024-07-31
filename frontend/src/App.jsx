import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RecipeForm from './Components/RecipeForm/RecipeForm'
import Login from './Components/Login/Login'
import UserRegister from './Components/Register/UserRegister'
import RootLayout from './Components/RootLayout/RootLayout';
import Home from'./Components/home/Home';
import Community from './Components/community/Community'
import Explore from './Components/explore/Explore'
import UserDashBoard from './Components/userDashBoard/UserDashBoard'
import Recipe from './Components/Recipe/Recipe'

function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path:"register",
          element: <UserRegister />
        },
        {
          path:"login",
          element: <Login />
        },
        {
          path:"recipeform",
          element: <RecipeForm />
        },
        {
          path:"community",
          element: <Community />
        },
        {
          path:"explore",
          element: <Explore />
        },
        {
          path:"dashboard",
          element: <UserDashBoard />
        },
        {
          path:"recipe/:recipeid",
          element: <Recipe />
        }
      ]
    }
  ])
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;