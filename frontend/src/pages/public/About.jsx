import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "../../components/Layout";

const About = () => {
  const [data, setData] = useState({
    listings_count: 0,
    active_users: 0,
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
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">About Echo</h1>
        <p className="text-lg mb-6 text-gray-700">
          <strong>Echo</strong> is more than just a marketplace—it's a space where music enthusiasts come together. 
          Whether you're an artist selling vintage gear or a beginner searching for your first instrument, 
          Echo connects you with a passionate, global music community.
        </p>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl text-white p-8 mt-10 shadow-lg">
          {loading ? (
            <p className="text-lg">Loading stats...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">{data.listings_count}</span>
                <p className="text-xl mt-2">Listings Shared</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">{data.active_users}</span>
                <p className="text-xl mt-2">Active Musicians</p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Section */}
        <div className="mt-10 text-gray-700 text-lg leading-relaxed">
          <p className="mb-4">
            We believe music is a universal language. Echo provides the tools for musicians to buy, sell, and collaborate with confidence. 
            Our platform is designed for simplicity, speed, and connection.
          </p>
          <p>
            Whether you're building your dream studio or clearing out your tour gear, Echo is here to echo your sound — worldwide.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
