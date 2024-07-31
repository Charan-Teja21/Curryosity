import { NavLink, Link, useNavigate } from 'react-router-dom'
import logo from '../../Asserts/Logo.png'
import { useState, useEffect } from 'react'
import './Navbar.css'
import { useSelector,useDispatch } from 'react-redux'
import { resetState } from '../../redux/slices/userSlice'
function Navbar() {
  let {loginUserStatus,errorOccurred,errMsg,currentUser}=useSelector(state=>state.useruserLoginReducer)

  const [menuOpen, setMenuOpen] = useState(false);
  let navigate = useNavigate()
  let Dispatch=useDispatch();
  function Signout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    Dispatch(resetState())
  }

  return (
    <nav className='mn shadow rounded'>
      <div className='row'>
        <div className='col-5'>

          <Link to='' className='logo ms-2'>
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className='col-3 mt-2'>
          <h3 className='display-6 fs-2'>Curryosity</h3>
        </div>
      </div>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ''} >
        {loginUserStatus === false ?
          <>
            <li>
              <NavLink to=''>Home</NavLink>
            </li>
            <li>
              <NavLink to='/explore'>Explore</NavLink>
            </li>
            <li>
              <NavLink to='/community'>Community</NavLink>
            </li>
            <li>
              <NavLink to='/register'>Register</NavLink>
            </li>
            <li>
              <NavLink to='/login'>Login</NavLink>
            </li>
          </> :
          (<>
            <li>
              <NavLink to=''>Home</NavLink>
            </li>
            <li>
              <NavLink to='/explore'>Explore</NavLink>
            </li>
            <li>
              <NavLink to='/community'>My AI</NavLink>
            </li>
            <li>
              <NavLink to='/dashboard'>{currentUser.username}
              </NavLink>
            </li>
            <li>
              <NavLink to="" className="signout" onClick={Signout}>
                Signout</NavLink>
            </li>
          </>
          )
        }
      </ul>
    </nav>
  )
}

export default Navbar