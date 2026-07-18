import { useEffect, useState } from "react";
import { fetchCategories } from "../services/api.js";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
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