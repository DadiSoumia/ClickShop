import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/categories`)
      .then((res) => {
        const mapped = res.data.data.map((c) => ({
          id: c.slug, 
          dbId: c._id, 
          name: c.name,
          image: c.image,
        }));
        setCategories(mapped);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}