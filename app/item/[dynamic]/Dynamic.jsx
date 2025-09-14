import React from 'react'

function Dynamic({slectedItem}) {
  return (
    <div>
        <img src={slectedItem.image} alt='' width={100}/>
        <p>{slectedItem.name}</p>
    </div>
  )
}

export default Dynamic