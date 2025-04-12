import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import axiosInstance from "../../utils/axiosInstance";

const CreateListing = () => {
    const navigate = useNavigate();

    // State to manage listing form fields
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        address: "",
        city: "",
        county: "",
        postal_code: "",
        category: "",
    });

    // State for image uploads and category list
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    // Fetch categories
    useEffect(() => {
        axiosInstance
        .get("categories/")
        .then((res) => setCategories(res.data))
    }, []);

    // Handle basic text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file and image upload and restrict to max 10 images
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images, ...files];

        if (newImages.length > 10) {
        alert("You can upload up to 10 images only.");
        return;
        }

        setImages(newImages);
    };

    // Remove image preview from upload list
    const handleRemoveImage = (index) => {
        const updated = [...images];
        updated.splice(index, 1);
        setImages(updated);
    };

    // Submit the form with all fields and images
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
    data.append(key, value);
    });

    images.forEach((image) => data.append("images", image));

    try {
        const res = await axiosInstance.post("listings/create/", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.status === 201) {
            navigate("/"); // Redirect to home after successful listing creation
        }
        } catch (err) {
        console.error("Failed to create listing", err.response || err);
        setError("Something went wrong. Please try again.");
        }
};

  return (
    <Layout>
      <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Create a New Listing</h2>

        {/* Display error message if submission fails */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Listing form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded"/>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded"/>
          <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price"required className="w-full p-2 border rounded"/>

            {/* Category select dropdown */}
          <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name_display}</option>
            ))}
          </select>
            
            {/* Address inputs */}
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="w-full p-2 border rounded"/>
          <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required className="w-full p-2 border rounded"/>
          <input name="county" value={formData.county} onChange={handleChange} placeholder="County" required className="w-full p-2 border rounded"/>
          <input name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Postal Code" required className="w-full p-2 border rounded"/>

            {/* Image upload input */}
          <input type="file" name="images" multiple onChange={handleImageChange} className="w-full" />
          {/* Preview selected images */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
            Create Listing
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateListing;
