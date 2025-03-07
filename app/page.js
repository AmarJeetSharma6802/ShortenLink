"use client"
import React, { useEffect, useState } from 'react'
import axios from "axios";


function page() {
    const [form ,setForm] =useState({originalUrl:"", shortUrl:""})
    const [success ,setSuccess] =useState("")
    const [shortLink ,setShortLink] =useState("")
    const [error ,seterror] = useState("")

    useEffect(()=>{
        const shortLink = localStorage.getItem("shortLink");
        if(shortLink){
            setShortLink(shortLink)
        }
    },[])

    const handleSubmit = async(e)=>{
      e.preventDefault()
      seterror("")
       try {
        //  console.log("Submitting form data:", form);
         
         const res = await axios.post("/api/Shorten", form, {
           headers: { "Content-Type": "application/json" }
       });
 
       const  newShortLink = res.data.shortUrl;

         setShortLink(newShortLink)
 
         localStorage.setItem("shortLink", newShortLink);

         setSuccess(alert("Link shortened successfully!"))
 
         setForm({originalUrl:"", shortUrl:""})
       } catch (error) {
        console.error("Error:", error.response?.data?.message || error.message);
        seterror(alert(error.response?.data?.message || "An error occurred."));
       }

    }

    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
  return (
    <div className='form'>
    <form onSubmit={handleSubmit}>
        <input type="text" name='originalUrl' value={form.originalUrl} onChange={handleForm} />
        <input type='text'name='shortUrl' value={ form.shortUrl} onChange={handleForm} />
        <button type='submit'>Submit</button>
        {
    success ? (
      <p>{success}</p>
    ):(
      <p>{error}</p>
    )
    }
    
    {shortLink && <a href={shortLink} target="_blank" className='anchor'>{shortLink}</a>}
    </form>

   
    </div>


  )
}

export default page