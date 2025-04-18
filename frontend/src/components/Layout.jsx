// Layout wraps all pages to provide consistent spacing and structure
import React from "react";


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-100 pt-24 pb-16 px-4">
      <main className="flex-grow flex justify-center items-start w-full">
        <div className="w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
};

export default Layout;

