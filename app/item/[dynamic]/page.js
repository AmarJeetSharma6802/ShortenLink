import Dynamic from "./Dynamic.jsx";

async function Page({ params }) {
  const res = await fetch("http://localhost:3000/api/imagekit", {
    cache: "no-store", 
  });
  const data = await res.json();

  const slugify = (details) => {
    return details
      .trim()
      .toLowerCase()
      .replace(/[,]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const { dynamic } = await params;

  const selectedItem = data.foundItem.find(
    (item) => slugify(item.name) === dynamic
  );

  if (!selectedItem) {
    return <p>No content found!</p>;
  }

  console.log("API response:", data);
  return (
    <div>
      <Dynamic slectedItem={selectedItem} />
    </div>
  );
}

export default Page;
