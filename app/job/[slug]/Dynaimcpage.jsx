"use client";
import React,{useState,useEffect} from "react";
import { usePathname } from "next/navigation";

function Dynaimcpage({ selectedContent }) {
     const pathname = usePathname(); 
  const [file, setFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplied, setIsApplied] = useState(false);


  const handleApply = async () => {
  if (!file) return alert("Please upload resume");
  if (!coverLetter) return alert("Write cover letter");

   if (isApplied) {
    return alert("You have already applied for this job");
  }

  const formData = new FormData();

  formData.append("resume", file); 
  formData.append("job", selectedContent._id);
  formData.append("companyName", selectedContent.companyName);
  formData.append("jobTitle", selectedContent.jobTitle);
  formData.append("salary", selectedContent.salary);
  formData.append("numberOfOpening", selectedContent.numberOfOpening);
  formData.append("coverLetter", coverLetter);
  formData.append("skills", selectedContent.skills.join(","));
  formData.append("url", pathname);

  const res = await fetch("http://localhost:5000/job/applicationData", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();
  alert(data.message);
  setIsApplied(true)
  
};

  useEffect(()=>{

    const fetchApplied = async()=>{

      const res = await fetch(`http://localhost:5000/job/checkApplied/${selectedContent._id}`,{
        credentials:"include"
      })
      const data = await res.json();
    setIsApplied(data.applied);
    }

    fetchApplied()
  },[selectedContent._id])

  
  return (
    <div>
      <div >
        <h1>{selectedContent.jobTitle}</h1>
        <p>{selectedContent.companyName}</p>
        <p>{selectedContent.description}</p>
        <p>Category: {selectedContent.category}</p>
        <p>Salary: {selectedContent.salary}</p>

        <textarea
        placeholder="Write your cover letter"
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
      />

        <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />
       <button onClick={handleApply}  disabled={isApplied}>{isApplied ? "Applied" : "Apply"}</button>
      </div>
      
    </div>
  );
}

export default Dynaimcpage;
