import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Browse Categories
      </h2>

      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="bg-white p-4 rounded shadow hover:shadow-md text-center cursor-pointer transition"
            >
              {cat.icon && (
                <img
                  src={`http://127.0.0.1:8000${cat.icon}`}
                  alt={cat.name}
                  className="w-20 h-20 mx-auto mb-2 object-contain"
                />
              )}
              <p className="text-sm text-purple-700 font-medium">
                {cat.name_display}
              </p>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Categories;

