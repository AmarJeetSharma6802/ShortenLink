// "use client";
// import React, { useEffect, useState } from "react";
// import {  useRouter } from "next/navigation";

// interface job{
//     _id: string;
//   image: string;
//   companyName: string;
//   slug: string;
//   jobTitle: string;
//   skills: string[];
// }
// interface user{
//   name:string
// }

// const page: React.FC = () => {
//   const [dt, setDt] = useState<job[]>([]);
//   const [userData, setuserData] = useState<user | null>(null);

//   const router = useRouter()

//   useEffect(() => {
//     const fetchJobs = async ():Promise<void> => {
//       const res = await fetch("http://localhost:5000/job/alljobs",{
//         credentials:"include"
//       });
//         if (!res.ok) {
//           alert("you are not login ")
//       router.push("/face/faceLogin"); 
//       return;
//     }
//       const data = await res.json();

//       setDt(data.findjobs);
//     };

//     fetchJobs();
//   }, []);


//   useEffect(()=>{
// const fetchUser = async ():Promise<void> => {
//       const res = await fetch("http://localhost:5000/job/userData",{
//         // credentials:"include"
//       });

    
//       const data = await res.json();

//       // console.log(data)
//       setuserData(data.user)

//     };

//     fetchUser();
//   },[])
  
  

// //  const makeSlug = (text) =>
// //     text
// //       .toLowerCase()
// //       .replace(/[,]/g, "")
// //       .replace(/\s+/g, "-")
// //       .replace(/-+/g, "-")
// //       .trim();

//   const handleClick = (slug) => {
//     router.push(`/job/${slug}`);
//   };
//   return (
//     <div>
//   {userData && (
//   <p>{userData.name}</p>
// )}

//       {dt.map((item) => {
//         return (
//           <div key={item._id}>
//             <img
//               src={item.image}
//               alt={item.companyName}
//               style={{ width: "50px" }}
//             />
//             <p>{item.companyName}</p>
//             <p>slug : {item.slug}</p>
//             <p>{item.jobTitle}</p>
//             <p>{item.skills}</p>
//             {/* <button onClick={() => handleClick(item.companyName)}> */}
//             <button onClick={() => handleClick(item.slug)}>
//               all details
//             </button>
//           </div>
//         );
//       })}

//     </div>
//   );
// }

// export default page;


"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Job {
  _id: string;
  image: string;
  companyName: string;
  slug: string;
  jobTitle: string;
  skills: string[];
}

interface User {
  name: string;
}

const fetchJobs = async () => {
  const res = await fetch("/job/alljobs", {
  });

  if (!res.ok) {
    throw new Error("Not logged in");
  }

  return res.json();
};

const fetchUser = async () => {
  const res = await fetch("/job/userData",{
    credentials: "include",

  });
  return res.json();
};


const Page = () => {
  const router = useRouter();

  const {
    data: jobRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  // 🔹 USER QUERY
  const { data: userRes } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  if (isLoading) return <p>Loading jobs...</p>;

  if (isError) {
    router.push("/face/faceLogin");
    return null;
  }

 const jobs: Job[] = jobRes || [];


  const userData: User | undefined = userRes?.user;

  return (
    <div>
      {userData && <h3>Welcome, {userData.name}</h3>}

      {jobs.map((item) => (
        <div key={item._id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <img src={item.image} alt={item.companyName} width={50} />
          <p>{item.companyName}</p>
          <p>Slug: {item.slug}</p>
          <p>{item.jobTitle}</p>
          <p>{item.skills.join(", ")}</p>

          <button onClick={() => router.push(`/job/${item.slug}`)}>
            All Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default Page;
