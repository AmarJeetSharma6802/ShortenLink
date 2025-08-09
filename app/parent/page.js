"use client"
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function page() {
    const router = useRouter()
    const item =[
         {
      id: 1,
      details:
        "Daikin 1.5 Ton 3 Star Inverter Split AC Copper, PM 2.5 Filter, Triple Display, Dew Clean",
      stars: "★ ★ ★ ★ ",
      lastStars: <i className="fa-regular fa-star"></i>,
      offer: "36%",
      p: "FREE delivery as soon as Sat, 24 May, 7 am - 9 pm",
      paid: "Service: Paid Installation",
      img: "https://m.media-amazon.com/images/I/61JyEPdw3UL._AC_UL320_.jpg",
      price: "37,490",
    },
    {
      id: 2,
      details:
        "Daikin 1.5 Ton 5 Star Inverter Split AC (Copper, PM 2.5 Filter, MTKM50U, White)",
      stars: "★ ★ ★ ★ ",
      lastStars: <i className="fa-regular fa-star"></i>,
      offer: "36%",
      p: "FREE delivery as soon as Sat, 24 May, 7 am - 9 pm",
      paid: "Service: Paid Installation",
      img: "https://m.media-amazon.com/images/I/6179B4CYGTL._AC_UL320_.jpg",
      price: "45,990",
    },
    {
      id: 3,
      details:
        "Daikin 0.8 Ton 3 Star, Fixed Speed Split AC (Copper, PM 2.5 Filter, 2022 Model, FTL28U, White)",
      stars: "★ ★ ★ ★ ",
      lastStars: <i className="fa-regular fa-star"></i>,
      offer: "40%",
      p: "FREE delivery as soon as Sat, 24 May, 7 am - 9 pm",
      paid: "Service: Paid Installation",
      img: "https://m.media-amazon.com/images/I/61mOVGinDdL._AC_UL320_.jpg",
      price: "26,490",
    },
    {
      id: 4,
      details:
        "Lloyd 1.0 Ton 3 Star Inverter Split AC (5 in 1 Convertible, Copper, Anti-Viral + PM 2.5 Filter, 2023 Model, White with Chrome Deco Strip, GLS12I3FWAEV/WAEA)",
      stars: "★ ★ ★ ★ ",
      lastStars: <i className="fa-regular fa-star"></i>,
      offer: "29%",
      p: "FREE delivery as soon as Sat, 24 May, 7 am - 9 pm",
      paid: "Service: Paid Installation",
      img: "https://m.media-amazon.com/images/I/41BJCIurt6L._AC_UL320_.jpg",
      price: "29,990",
    },
    ]

    const handleDynamic =(details)=>{
        const slug = details.trim()
        .toLowerCase() 
        .replace(/[,]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
        router.push(`/${slug}`)
    }

  return (
    <div style={{textAlign:"center"}}>
    <h1>AC SECTION</h1>
    {
        item.map((item)=>{
            return(
                <div key={item.id} style={{lineHeight:"2" ,padding:"10px"}}>
                    <Image src={item.img} alt={item.details} height={100} width={250} />
                    <p>Details : {item.details}</p>
                    <p>price : {item.price}</p>
                    <p>offer : {item.offer}</p>
                    <button onClick={()=> handleDynamic(item.details)}>check more details</button>
                </div>
            )
        })
    }
    </div>
  )
}

export default page