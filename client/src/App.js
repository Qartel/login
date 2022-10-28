import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Private from './Private';
import './Styles.css';

function App() {

  return (
    <Router>
      <div className="container">
        <div className='wrapper'>
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/private' element={<Private/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
