import Footer from "@/components/generic/Footer";
import Header from "@/components/generic/Header";
import BackToTop from "@/components/generic/backToTop";
import { useAuth } from "@/contexts/AuthContext";
import { AppRoutes, AuthRoutes } from "@/routes/app-routes";
import { data, Navigate, Outlet, useLocation } from "react-router-dom";

const ClientLayout = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const isActive = user?.status === "active";
  console.log({ user, isAdmin });

  if (user && isActive && AuthRoutes.includes(location.pathname)) {
    return <Navigate to={AppRoutes.home()} replace />;
  }

  // if (isAdmin) {
  //   return <Navigate to={AppRoutes.adminDashboard()} replace />;
  // }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow main pt-[80px] md:pt-[88px]">
        <Outlet />
        <BackToTop />
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
