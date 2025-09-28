import React from 'react'
import DynamicPage from './DynamicPage'

export async function generateMetadata({ params }) {

    const {name} = await params

    const contentName = name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

    return{
        title: `${contentName} `,
    
    }
}

 const item =[
         {
      id: 1,
      detail:
        "Daikin 1.5 Ton 3 Star Inverter Split AC Copper, PM 2.5 Filter, Triple Display, Dew Clean",
      stars: "★ ★ ★ ★ ",
      lastStars: <i className="fa-regular fa-star"></i>,
      offer: "36%",
      p: "FREE delivery as soon as Sat, 24 May, 7 am - 9 pm",
      paid: "Service: Paid Installation",
      price: "37,490",
       gallery: [
      'https://m.media-amazon.com/images/I/6179B4CYGTL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/81QGKn2LCfL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/51fg3w--ZLL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/81U8DQGrBNL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/71J1xlk3ICL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/813yL92JRpL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/812sgiHEtQL._SX679_.jpg',
    ],
    },
    {
      id: 2,
      detail:
        "Daikin 1.5 Ton 5 Star Inverter Split AC (Copper, PM 2.5 Filter, MTKM50U, White)",
      stars: "★ ★ ★ ★ ",
      lastStars: <i className="fa-regular fa-star"></i>,
      offer: "36%",
      p: "FREE delivery as soon as Sat, 24 May, 7 am - 9 pm",
      paid: "Service: Paid Installation",
      price: "45,990",
      gallery: [
      'https://m.media-amazon.com/images/I/61JyEPdw3UL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/81QGKn2LCfL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/51fg3w--ZLL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/81U8DQGrBNL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/71J1xlk3ICL._SX679_.jpg',
      'https://m.media-amazon.com/images/I/813yL92JRpL._SX679_.jpg',
    ],
    },
    {
      id: 3,
      detail:
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
      detail:
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

const slugify = (details) => {
  return details
    .trim()
    .toLowerCase()
    .replace(/[,]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

function page({params}) {

    const {name} = params


    const slectedItem = item.find((item)=> slugify(item.detail)=== name)
     
    if (!slectedItem) {
    // console.log("No match found for:", DynamicDetails);
    return <p>No content found!</p>;
  }
  return (
    <div>
    <DynamicPage slectedItem = {slectedItem}/>
    </div>
  )
}

export default page