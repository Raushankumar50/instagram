import React, { useState } from 'react';
import "../css/Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Modal from "./Modal";   //  Correct import

const Navbar = ({ login }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // local state

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");

    if (login || token) {
      return (
        <>
          <Link to={"/profile"}>
            <li>Profile</li>
          </Link>

          <Link to={"/createPost"}>
            Create Post
          </Link>

          <Link style={{ marginLeft: "20px" }} to="/followingpost">
            My Following
          </Link>

          <Link to={""}>
            <button
              className='primaryBtn'
              onClick={() => setIsModalOpen(true)}
            >
              Log Out
            </button>
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link to={"/signup"}>
            <li>SignUp</li>
          </Link>
          <Link to={"/signin"}>
            <li>SignIn</li>
          </Link>
        </>
      );
    }
  };

  return (
    <>
      <div className='navbar'>
        <img
          src="/logo.png"
          alt=""
          onClick={() => navigate("/")}
        />

        <ul className='nav-menu'>{loginStatus()}</ul>
      </div>

      {/*  Show confirmation modal only when clicked */}
      {isModalOpen && (
        <Modal setModalOpen={setIsModalOpen} />
      )}
    </>
  );
};

export default Navbar;










// import React, {useContext} from 'react'
// import "../css/Navbar.css"
// import {Link} from "react-router-dom"
// import { LoginContext } from '../context/LoginContext'
// import { useNavigate } from 'react-router-dom'

// const Navbar = ({login}) => {
//   const navigate = useNavigate();
//   const {setModalOpen} = useContext(LoginContext)
//   const loginStatus = () => {
//     const token = localStorage.getItem("jwt");
//     if(login || token){
//       return [
//         <>
//           <Link to={"/profile"}>
//             <li>Profile</li>
//           </Link>
//           <Link to={"/createPost"}>Create Post</Link>
//           <Link style={{ marginLeft: "20px" }} to="/followingpost">
//             My Following
//           </Link>
//           <Link to={""}>
//             <button className='primaryBtn' onClick={() => setModalOpen(true)}>
//               Log Out</button>
//           </Link>
//         </>,
//       ];
//     } else {
//         return [
//           <>
//             <Link to={"/signup"}>
//               <li>SignUp</li>
//             </Link>
//             <Link to={"/signin"}>
//               <li>SignIn</li>
//             </Link>
//           </>,
//         ];
//     }
//   };

//   return (
//     <div className='navbar'>
//       <img src="/logo.png" alt="" onClick={() => {
//         navigate("/")
//       }} />
//       <ul className='nav-menu'>{loginStatus()}</ul>
//     </div>
//   )
// }

// export default Navbar
