// import logo from './logo.svg';
import './App.css';
import React, {createContext, useState} from 'react'
import Home from './screens/Home';
import Navbar from './components/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Profile from './screens/Profile';
import Createpost from './screens/Createpost';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { LoginContext } from './context/LoginContext'; 
import Modal from './components/Modal';
import UserProfie from './components/UserProfile';
import MyFollowingPost from './screens/MyFollowingPost';

function App() {
  const [userLogin, setUserLogin] = useState(false)
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{setUserLogin, setModalOpen}}>
          <Navbar login={userLogin}/>
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/signup" element={<SignUp/>}></Route>
            <Route path="/signin" element={<SignIn/>}></Route>
            <Route exact path="/profile" element={<Profile/>}></Route>
            <Route path="/createPost" element={<Createpost/>}></Route>
            <Route path="/profile/:userid" element={<UserProfie />}></Route>
            <Route path='/followingpost' element={<MyFollowingPost/>} ></Route>
          </Routes>
          <ToastContainer theme='dark' />
          {modalOpen && <Modal setModalOpen={setModalOpen}></Modal>}
        </LoginContext.Provider>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
