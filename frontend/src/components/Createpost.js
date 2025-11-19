import React, {useState, useEffect} from 'react'
import './Createpost.css'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Createpost = () => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate()

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    // saving post to mongodb
    if(url){
      fetch("http://localhost:5000/createPost",{
      method:"post",
      headers:{
        "Content-Type":"application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        body,
        pic: url
      })
    }).then(res => res.json())
      .then(data => {
        if(data.error){
          notifyA(data.error)
        } else {
          notifyB("Successfully Posted")
          navigate("/")
        }
      })
      .catch(err=> console.log(err))
      }
  }, [url])

  // posting image to cloudinary
  const postDetails = () =>{
    console.log(body, image)
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "instagram")
    data.append("cloud_name", "dwdjayxmb")
    fetch("https://api.cloudinary.com/v1_1/dwdjayxmb/image/upload",
      {
        method:"post",
        body:data
      }
    ).then(res=>res.json())
      .then(data => setUrl(data.url))
      .catch(err => console.log(err))
    console.log(url)
     
  }


  const loadFile = (event) => {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src) // free memory
    }
  }
  return (
    <div className='createPost'>
      <div className='post-header'>
        <h4 style={{margin: "3px auto"}}>Create New Post</h4>
        <button id="post-btn" onClick={()=> {postDetails()}}>Share</button>
      </div>
      <div className='main-div'>
        <img id="output" src='https://cdn3d.iconscout.com/3d/premium/thumb/galeria-3d-icon-png-download-7139045.png' />
        <input 
          type="file" 
          accept="image/*" 
          onChange={(event) => {
            loadFile(event)
            setImage(event.target.files[0])
            }}
          />
      </div>

      {/* details */}
      <div className='details'>
        <div className='card-header'>
          <div className="card-pic">
            
          <img 
            src='https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt=''/>
          </div>
          <h5>Rahul</h5>
        </div>
        <textarea value={body} onChange={(e) => {
          setBody(e.target.value)
        }}
          type='text' placeholder='Write a caption....' ></textarea>
      </div>
    </div>
  )
}

export default Createpost
