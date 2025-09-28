"use client"
import React, { useState } from "react";

function DynamicPage({ slectedItem }) {
  // Set the first image as default main image
  const [mainImage, setMainImage] = useState(
    slectedItem.gallery[0]
  );

  const handleImage =(img)=>{
    setMainImage(img)
  }

  return (
    <div style={{ textAlign: "center" }}>
      {/* Main Image */}
      <div>
        <img
          src={mainImage}
          alt={slectedItem.detail}
          style={{ width: "400px", height: "400px", objectFit: "contain" }}
        />
      </div>

      {/* Thumbnails */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", gap: "10px" }}>
        {slectedItem.gallery &&
          slectedItem.gallery.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index}`}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
                cursor: "pointer",
                border: mainImage === img ? "2px solid blue" : "1px solid gray",
              }}
              onClick={() => handleImage(img)}
            />
          ))}
      </div>

      {/* Product Info */}
      <div style={{ marginTop: "20px" }}>
        <p>{slectedItem.detail}</p>
        <p>{slectedItem.stars}</p>
        <p>Price: {slectedItem.price}</p>
        <p>Offer: {slectedItem.offer}</p>
      </div>
    </div>
  );
}

export default DynamicPage;
