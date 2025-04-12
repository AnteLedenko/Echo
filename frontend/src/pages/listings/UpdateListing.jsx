import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import axiosInstance from "../../utils/axiosInstance";

const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form data and states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    city: "",
    county: "",
    postal_code: "",
    category: "",
    is_sold: false,
  });

  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch listing details and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listingRes = await axiosInstance.get(`listings/${id}/`);

        // Block if user is not the owner
        if (!listingRes.data.is_owner) {
          setIsOwner(false);
          setError("You are not authorized to edit this listing.");
          return;
        }

        const categoryRes = await axiosInstance.get("categories/");

        // Pre-fill form with fetched data
        setFormData({
          title: listingRes.data.title,
          description: listingRes.data.description,
          price: listingRes.data.price,
          address: listingRes.data.address,
          city: listingRes.data.city,
          county: listingRes.data.county,
          postal_code: listingRes.data.postal_code,
          category: listingRes.data.category,
          is_sold: listingRes.data.is_sold,
        });

        setExistingImages(listingRes.data.images);
        setCategories(categoryRes.data);
      } catch (err) {
        setError("Could not load listing. Are you logged in?");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle form input changes text and files
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const filesArray = Array.from(files);
      const total = newImages.length + existingImages.length - deleteImages.length + filesArray.length;

      // Limit total images to 10
      if (total > 10) {
        alert("You can only upload up to 10 images.");
        return;
      }

      setNewImages((prev) => [...prev, ...filesArray]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Remove added image before submitting
  const handleRemoveNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  // Mark existing image for deletion
  const handleRemoveExistingImage = (id) => {
    setDeleteImages((prev) => [...prev, id]);
  };

  // Submit the updated listing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    newImages.forEach((img) => data.append("images", img));
    deleteImages.forEach((id) => data.append("delete_images", id));

    try {
      const res = await axiosInstance.put(`listings/${id}/update/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        navigate(`/listings/${id}`);
      }
    } catch (err) {
      setError("Something went wrong while updating.");
    }
  };

  // Redirects for unauthorized or unauthenticated users
  if (!localStorage.getItem("access")) {
    return (
      <Layout>
        <div className="text-center mt-20 text-red-600 text-lg font-semibold">
          You must be logged in to access this page.
        </div>
      </Layout>
    );
  }

  if (!isOwner) {
    return (
      <Layout>
        <div className="text-center mt-20 text-red-600 text-lg font-semibold">
          You are not authorized to edit this listing.
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-20 text-gray-600">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Update Listing</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Listing Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded"/>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded"/>
          <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 border rounded"/>
             
          {/* Category Dropdown */}
          <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name_display}</option>
            ))}
          </select>

          {/* Address Info */}     
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="w-full p-2 border rounded"/>
          <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required className="w-full p-2 border rounded"/>
          <input name="county" value={formData.county} onChange={handleChange} placeholder="County" required className="w-full p-2 border rounded"/>
          <input name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Postal Code" required className="w-full p-2 border rounded"/>

          {/* Sold checkbox */}
          <input type="checkbox" name="is_sold" checked={formData.is_sold} onChange={(e) => setFormData(prev => ({ ...prev, is_sold: e.target.checked }))} className="mr-2"/>
          <label htmlFor="is_sold">Mark as sold</label>

          <input type="file" name="images" multiple onChange={handleChange} className="w-full" />

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Current Images:</h4>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {existingImages
                  .filter((img) => !deleteImages.includes(img.id))
                  .map((img) => (
                    <div key={img.id} className="relative">
                      <img
                        src={`${CLOUDINARY_BASE}/${img.image}`}
                        alt="Existing"
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(img.id)}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Preview newly added images */}  
          {newImages.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">New Images:</h4>
              <div className="grid grid-cols-3 gap-3">
                {newImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${index}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit button */}    
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default UpdateListing;



