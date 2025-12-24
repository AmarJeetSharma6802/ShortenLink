"use client";
import React, { useEffect, useState } from "react";
import {  useRouter } from "next/navigation";

function page() {
  const [dt, setDt] = useState([]);
  const [userData, setuserData] = useState(null);

  const router = useRouter()

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch("http://localhost:5000/job/alljobs");
      const data = await res.json();

      setDt(data.findjobs);
    };

    fetchJobs();
  }, []);


  useEffect(()=>{
const fetchUser = async () => {
      const res = await fetch("http://localhost:5000/job/userData",{
        credentials:"include"
      });
      const data = await res.json();

      // console.log(data)
      setuserData(data.user)

    };

    fetchUser();
  },[])
  
  

 const makeSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[,]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const handleClick = (companyName) => {
    router.push(`/job/${makeSlug(companyName)}`);
  };
  return (
    <div>
  {userData && (
  <p>{userData.name}</p>
)}
      {dt.map((item) => {
        return (
          <div key={item._id}>
            <img
              src={item.image}
              alt={item.companyName}
              style={{ width: "50px" }}
            />
            <p>{item.companyName}</p>
            <p>{item.jobTitle}</p>
            <p>{item.skills}</p>
            <button onClick={() => handleClick(item.companyName)}>
              all details
            </button>
          </div>
        );
      })}

    </div>
  );
}

export default page;
