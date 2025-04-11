import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "../../components/Layout";

const About = () => {
  const [data, setData] = useState({
    listings_count: null,
    active_users: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const res = await axiosInstance.get("/about/");
        setData(res.data);
      } catch (err) {
        console.error("Failed to load about data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutInfo();
  }, []);

  return (
    <Layout>
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">About Echo</h1>
        <p className="text-lg mb-6">
            Echo is a modern marketplace for aspiring musicians, collectors, and creators.
            Whether you're looking to buy, sell, or trade instruments and studio gear,
            Echo connects you with a passionate global music community.
        </p>


        {loading ? (
            <p className="text-gray-500">Loading stats...</p>
        ) : (
            <div className="space-y-2">
            <p className="text-md">
                <strong>{data.listings_count}</strong> total listings posted.
            </p>
            <p className="text-md">
                <strong>{data.active_users}</strong> active musicians using Echo.
            </p>
            </div>
        )}
        </div>
    </Layout>
  );
};

export default About;
