import { UserButton } from '@clerk/nextjs'
import React from 'react'

function Navbar() {
  return (
    <div>
        <header>
            <label><span><i className="fa-solid fa-link"></i></span> ShortenLink</label>
            <nav>
              <a href=''><i className="fa-brands fa-github"></i></a>
              <a href=''><i className="fa-brands fa-linkedin-in"></i></a>
              <UserButton/>
            </nav>
        </header>
    </div>
  )
}

export default Navbar