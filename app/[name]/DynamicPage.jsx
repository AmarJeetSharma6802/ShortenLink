import React from "react";

function DynamicPage({ slectedItem }) {
  return (
    <div>
      <img src={slectedItem.img} alt="" />
      <p>{slectedItem.detail}</p>
      <p>{slectedItem.stars}</p>
      <p>price : {slectedItem.price}</p>
      <p>offer : {slectedItem.offer}</p>
    </div>
  );
}

export default DynamicPage;
