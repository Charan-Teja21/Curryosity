import React, { useState, useEffect } from 'react';
import './Home.css';
import First from './first/First';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [comp1, setComp1] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:3000/first")
      .then(res => res.json())
      .then(UserList1 => setComp1(UserList1));
  }, []);

  function handleView() {
    navigate('/explore');
  }

  return (
    <div className="home">
      <div className='row mt-3 mb-3'>
        <div className='col-md-6 col-sm-12 ps-5 pe-5'>
          <h1 className='main1'>Dish of the Week</h1>
          <h3>Chicken Biryani</h3>
          <p>Spicy Chicken Biryani is a flavorful dish consisting of aromatic basmati rice and tender chicken pieces. Cooked with a blend of traditional spices such as cardamom, cloves, and cinnamon, each bite offers a burst of rich and complex flavors. The chicken is marinated in a yogurt-based mixture infused with garlic, ginger, and chili, adding depth to the dish. Layered with fragrant saffron-infused rice, caramelized onions, and fresh herbs like cilantro and mint, it offers a delightful sensory experience. Served with cooling raita, the biryani strikes a perfect balance between heat and soothing flavors, making it a beloved dish in Indian cuisine. Whether enjoyed at festive gatherings or as a comforting meal at home.</p>
        </div>
        <div className='col-md-6 col-sm-12 d-flex justify-content-evenly'>
          <img className='imgf1 img-fluid' src="https://imgs.search.brave.com/fEGPqrd2UhH3Y-rv__NQHiRJoFg_c7zHLMmZo8CgEQo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9n/b3VybWV0LWJpcnlh/bmktd2l0aC1zYWZm/cm9uLXJpY2UtY2hp/Y2tlbi1nZW5lcmF0/ZWQtYnktYWlfMTg4/NTQ0LTM5MDkzLmpw/Zz9zaXplPTYyNiZl/eHQ9anBn" alt="" />
        </div>
      </div>
      <div className='main2'>
        <div className='d-flex justify-content-between'>
          <h3 className='mt-3 ms-3 bg-white d-inline p-2' style={{ borderRadius: 15 }}>Famous Recipes</h3>
          <button className='m-3 p-2 bg-dark text-white' onClick={handleView} style={{ borderRadius: 50 }}>View All</button>
        </div>
        <div className="Nonveg container-fluid d-flex justify-content-evenly mx-auto">
          <div className="row row-cols-sm-2 row-cols-md-3 ff">
            {comp1.map((ele, index) => (
              <First key={index} obj={ele} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;