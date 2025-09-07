import React from "react";
import Navbar from "./Navbar";
import UserHeader from "./UserHeader";

type Params = {
  userId: string;
  userSlug: string;
};

type UserLayoutProps = {
  children: React.ReactNode;
  params: Params;
};

const Layout = ({ children, params }: UserLayoutProps) => {
  return (
    <div className="container mx-auto space-y-4 px-4 pb-20 pt-32">
      {/* UserHeader is async Server Component */}
      <UserHeader userId={params.userId} />

      <div className="flex flex-col gap-4 sm:flex-row">
        <Navbar />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
