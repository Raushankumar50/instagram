import React, {useState, useEffect} from 'react'
import './Profile.css'
import PostDetail from './PostDetail';
import ProfilePic from "./ProfilePic";


const Profile = () => {
  const [pic, setPic] = useState([])
  const [show, setShow] = useState(false)
  const [posts, setPosts] = useState([])
  const [changePic, setChangePic] = useState(false)


  const toggleDetails = (post) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(post);
    }
  };

  const changeprofile = () => {
    if (changePic) {
      setChangePic(false)
    } else {
      setChangePic(true)
    }
  }

  useEffect(() => {
    fetch("http://localhost:5000/myposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPic(result)
        console.log(pic)
        // console.log(result)
        // setPic(result.post);
        // setUser(result.user)
        // console.log(pic);
      });
  }, []);

  return (
    <div className="profile">
      {/* Profile frame */}
      <div className='profile-frame'>
        <div className='profile-pic'>
          <img 
            onClick={changeprofile}
            src='https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt=''/>
        </div>
        {/* profile-data */}
        <div className='profile-data'>
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className='profile-info' style={{display: "flex"}}>
            <p>40 posts</p>
            <p>40 followers</p>
            <p>40 following</p>
          </div>
        </div>
      </div>
      <hr 
        style={{
          width: "90%",
          margin: "25px auto",
          opacity: "0.8",
        }}
      />

      {/* Gallery */}
      <div className='gallery'>
          {pic.map((pics) => {
            return <img key={pics._id} src={pics.photo} 
            onClick={() => {
              toggleDetails(pics)
            }}
            className='item' />
          })}
      </div>
      {show &&
        <PostDetail item={posts} toggleDetails={toggleDetails} />
      }
      {
        changePic &&
        <ProfilePic changeprofile={changeprofile} />
      }
    </div>
  )
}

export default Profile
