import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './App.css';
import Fetchdata from './Component/Fetchdata';
import Cart from './Cart';


function App() {
 
  return (
   

    <Router>
    <Routes>
      <Route path="/" element={<Fetchdata />} />  
      <Route path="/cart" element={<Cart/>} />
    </Routes>
  </Router>


  );
}

export default App;

