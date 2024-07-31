import React from 'react'
import './First.css'
function First(props) {
  return (
    <div className="container cnt g-4">
      <div className="card d-flex mx-auto card2 text-center ">
        <div className='z'>
          <div className='zx'>
          <img className='img1' src={props.obj.image} alt="" />
          </div>
          <div className="card-body">
            <div className='info'>
              <p className='b'>{props.obj.name}</p>
              <p className='text-start'>{props.obj.description}</p>
            </div>
          </div>
        </div>
        <div className='y'>


        </div>
      </div>
    </div>
  )
}

export default First;