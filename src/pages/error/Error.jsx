import React from 'react';
import './Error.css'
import er from './404-removebg-preview.png';
import { useNavigate } from 'react-router-dom';
const Error = () => {
   const navigate = useNavigate();
   const handleClick = () =>{
     navigate('/')
   }
    return (
        <div className='error-page'>
            <img src={er}/>
            <p>Sorry, the page you visited does not exist</p>
            <button onClick={() =>handleClick()}> Back home</button>
        </div>
    );
};

export default Error;