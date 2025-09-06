import React from 'react'
import ResetPassPage from "../restPass/ResetPass.jsx"
import { Suspense } from "react";

function page() {
  return (
    <div>
     <Suspense fallback={<p>Loading form...</p>}>
     <ResetPassPage/>
     </Suspense>
    </div>
  )
}

export default page