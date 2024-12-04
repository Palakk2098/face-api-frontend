import React from 'react';
import { ToastContainer } from 'react-toastify';
import AddFace from './components/AddFace';
import RecognizeFace from './components/RecognizeFace';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
const App: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', margin: '2rem' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Face Recognition App</h1>
      <AddFace />
      <RecognizeFace />
    </div>
  );
};

export default App;
