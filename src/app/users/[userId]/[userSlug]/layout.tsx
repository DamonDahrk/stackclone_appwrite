import React from "react";
import Navbar from "./Navbar";
import UserHeader from "./UserHeader";

// No manual types for params
const Layout = ({ children, params }: any) => {
  return (
    <div className="container mx-auto space-y-4 px-4 pb-20 pt-32">
      {/* Async server component fetches user */}
      <UserHeader userId={params.userId} />

      <div className="flex flex-col gap-4 sm:flex-row">
        <Navbar />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
