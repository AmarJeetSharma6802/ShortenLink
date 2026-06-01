"use client"
import React, { useEffect, useState } from "react";

interface RestApi {
  _id: string;
  name: string;
  price: string;
  image: string;
}

interface FormState {
  name: string;
  price: string;
  image: File | null;
}

function Page() {
  const [data, setData] = useState<RestApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    image: null,
  });
  const [edit, setEdit] = useState<RestApi | null>(null);

  const fetchItems = async (): Promise<void> => {
    try {
      const res = await fetch("https://restapi-o1q5.onrender.com/itemApi");
      const result: RestApi[] = await res.json();
      setData(result);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleModel = (item: RestApi) => {
    setEdit(item);

    setForm({
      name: item.name,
      price: item.price,
      image: null,
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!edit) return;

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);

      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await fetch(
        `https://restapi-o1q5.onrender.com/itemApi/updateImage/${edit._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Update failed");
      }

      await fetchItems();

      setEdit(null);

      setForm({
        name: "",
        price: "",
        image: null,
      });
      alert("Updated successfully");
    } catch (error) {
      console.log("Update error:", error);
      alert("Update failed");
    }
  };

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setForm({ ...form, [name]: files?.[0] ?? null });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        padding: "20px",
      }}
    >
      {data.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "1rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
          onClick={() => handleModel(item)}
        >
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />

          <h3>{item.name}</h3>
          <p>Rs. {item.price}</p>
        </div>
      ))}

      {edit && (
        <div
          style={{
            position: "fixed",
            top: "-20%",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              minWidth: "320px",
            }}
          >
            <p>{edit.name}</p>
            <label>Name</label>
            <input
              type="text"
              placeholder="name"
              name="name"
              value={form.name}
              onChange={handleForm}
            />
            <label>Price</label>
            <input
              type="text"
              placeholder="price"
              name="price"
              value={form.price}
              onChange={handleForm}
            />
            <label>Image</label>
            <input type="file" name="image" onChange={handleForm} />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setEdit(null)}>
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Page;
