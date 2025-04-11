import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Categories from "../pages/public/Categories";
import CategoryListings from '../pages/public/CategoryListings';
import SearchResults from '../pages/public/SearchResults';


const PublicRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="categories" element={<Categories />} />
    <Route path="categories/:slug" element={<CategoryListings />} />
    <Route path="search" element={<SearchResults />} />
  </Routes>
);

export default PublicRoutes;
