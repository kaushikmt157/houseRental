import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.scss";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: null
    })

    const handleFormDataChange = (event) => {
        const {name, value, files} = event.target;
        setFormData({
            ...formData,
            [name]: value,
            [name]: name === "profileImage" ? files[0] : value
        })
    }

    console.log(formData)

    const [passwordMatch, setPasswordMatch] = useState(true);

    useEffect(() => {
      setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "")
    })

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault()
      
      try {
        const register_form = new FormData()
        
        for(let key in formData) {
          register_form.append(key, formData[key])
        }

        const response = await fetch("http://localhost:7000/auth/register", {
          method: "POST",
          body: register_form
        })

        if(response.ok) {
          console.log("Registration Done.");
          navigate("/login")
        }
      } catch (err) {
        console.log("ERROR: Registration failed. ", err.message);
      }

    }
  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input placeholder="First Name" name="firstname" value={formData.firstname} onChange={handleFormDataChange} required />
          <input placeholder="Last Name" name="lastname" value={formData.lastname} onChange={handleFormDataChange} required />
          <input placeholder="Email" name="email" type="email" value={formData.email} onChange={handleFormDataChange} required />
          <input
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password} 
            onChange={handleFormDataChange}
            required
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword} 
            onChange={handleFormDataChange}
            required
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords did not matched.</p>
          )}

          <input
            id="uploadImg"
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleFormDataChange}
            required
            style={{ display: "none" }}
          />
          <label htmlFor="uploadImg">
            <img src="/assets/addImage.png" alt="add profile photo" />
            <p>Upload Profile Photo</p>
          </label>

          {formData.profileImage && (
            <img src={URL.createObjectURL(formData.profileImage)} 
            alt="Profile Image" 
            style={{ maxWidth: "80px" }}/>
          )}
          <button type="submit" disabled={!passwordMatch}>REGISTER</button>
        </form>
        <a href="/login">Already have an account? Login Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
