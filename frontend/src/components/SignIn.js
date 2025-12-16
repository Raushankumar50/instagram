import React, {useState, useContext} from 'react'
import "../css/SignIn.css"
import {Link, useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import { LoginContext } from '../context/LoginContext'

const SignIn = () => {
  const {setUserLogin} = useContext(LoginContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  
    const postData = () => {
      // checking email
      if(!emailRegex.test(email)) {
        notifyA("Invalid email")
        return
      } 
      
      // Sending data to server
      fetch("http://localhost:5000/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body:JSON.stringify({
          email: email,
          password: password
        })
      }).then(res=> res.json())
        .then(data => {
          if(data.error) {
            notifyA(data.error)
          } else {
            notifyB("Signed In Successfully")
            console.log(data)
            localStorage.setItem("jwt", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
            
            setUserLogin(true)
            navigate("/")
          }
          console.log(data)
        })
    }
  return (
    <div className='signIn'>
      <div>
        <div className='loginForm'>
          <img className='signInLogo' src="./logo.png" alt="Logo" />
          <div>
            <input type="email" name='email' id='email' value={email} placeholder='Email' onChange={(e) => { setEmail(e.target.value)}} />
          </div>
          <div>
            <input type='password' name='password' id='password' value={password} placeholder='Password' onChange={(e) => { setPassword(e.target.value)}} />
          </div>
          <div>
            <input type='submit' name='button' id='login-btn' vlaue='Log in' onClick={() => {postData()}} />
          </div>
        </div>

        <div className='loginForm2'>
          Don't have an account? 
          <Link to="/signup">
            <span style={{color: "blue", cursor: "pointer"}}> Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn
