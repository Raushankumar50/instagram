import React, { useState} from 'react'
import "../css/SignUp.css"
import {Link, useNavigate} from "react-router-dom"
import {toast} from 'react-toastify'

const SignUp = () => {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

  const postData = () => {
    // checking email
    if(!emailRegex.test(email)) {
      notifyA("Invalid email")
      return
    } else if(!passRegex.test(password)){
      notifyA("Password must contain at least 8 characters, including at least 1  number and 1  includes both lower and uppercase letters characters for example #, ?, !")
      return
    }
    
    // Sending data to server
    fetch("http://localhost:5000/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        email: email,
        password: password,
        name: name,
        userName: userName
      })
    }).then(res=> res.json())
      .then(data => {
        if(data.error) {
          notifyA(data.error)
        } else {
          notifyB(data.message)
          navigate("/signin")
        }
      })
  }

  return (
    <div className='signUp'>
      <div className='form-container'>
        <div className='form'>
          <img className='signUpLogo' src="/logo.png" alt=""/>
          <p className="loginPara">
            Sign up to see photos and videos <br /> from your friends
          </p>
          <div>
            <input type="email" name="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder='Email'/>
          </div>
          <div>
            <input type="password" name="password" id="password" placeholder='Password' value={password} onChange={(e) => {setPassword(e.target.value)}} />
          </div>
          <div>
            <input type="text" name="fullname" id="fullname"  placeholder='Full Name' value={name} onChange={(e) => {setName(e.target.value)}} />
          </div>
          <div>
            <input type="text" name="username" id="username" placeholder='Username' value={userName} onChange={(e) => {setUserName(e.target.value)}} />
          </div>
          <p
            className="loginPara"
            style={{ fontSize: "12px", margin: "3px 0px" }}
          >
            People who use our service may have uploaded <br /> your contact information to Instagram. Learn <br/> More
          </p>
          <p
            className="loginPara"
            style={{ fontSize: "12px", margin: "3px 0px" }}
          >
            By signing up, you agree to out Terms, <br /> privacy policy and
            cookies policy.
          </p>
          <input type="submit" id="submit-btn" value="Sign Up" onClick={() => {postData()}} />
        </div>
        <div className="form2">
          Already have an account ? <br/>
          <Link to="/signin">
            <span style={{ color: "blue", cursor: "pointer" }}>Log in</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp
