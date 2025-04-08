import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateListing from "../pages/listings/CreateListing";
import ListingDetail from "../pages/listings/ListingDetail";
import UpdateListing from "../pages/listings/UpdateListing";
import DeleteListing from "../pages/listings/DeleteListing";
import MyListings from "../pages/listings/MyListings";
import SavedListings from "../pages/listings/SavedListings"


const ListingsRoutes = () => {
  return (
    <Routes>
      <Route path="create" element={<CreateListing />} />
      <Route path=":id" element={<ListingDetail />} />
      <Route path=":id/update" element={<UpdateListing />} />
      <Route path=":id/delete" element={<DeleteListing />} />
      <Route path="/my" element={<MyListings />} />
      <Route path="/saved" element={<SavedListings />} />
    </Routes>
  );
};

export default ListingsRoutes;
