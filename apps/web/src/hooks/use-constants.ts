import { AppRoutes } from "@/routes/app-routes";
import { PersonIcon } from "@radix-ui/react-icons";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Newspaper,
  Play,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const useConstants = () => {
  // Brand Colors
  const BrandColors = {
    red: "#C00000",
    blue: "#1C2852",
    beige: "#C4B696",
    light: "#E6E6E6",
  };

  const navItems = [
    {
      key: "dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      path: AppRoutes.dashboard,
    },
    {
      key: "recommendation",
      name: "Recommendation",
      icon: TrendingUp,
      path: "/user/app/recommendation",
    },
    {
      key: "premium_webinars",
      name: "Premium Webinars",
      icon: Play,
      path: "/user/app/premium-webinars",
    },
    {
      key: "scratch_pad_newsletter",
      name: "Scratch Pad Newsletter",
      icon: Newspaper,
      path: AppRoutes.scratch_pad_newsletter,
    },
    {
      key: "my_account",
      name: "My Account",
      icon: User,
      path: "/user/app/account/edit-profile", // assuming the base path is for editing
      subItems: [
        {
          key: "edit_profile",
          name: "Edit Profile",
          path: "/user/app/account/edit-profile",
          icon: Settings,
        },
        {
          key: "show_subscription",
          name: "Show Subscription",
          path: "/user/app/account/subscription",
          icon: CreditCard,
        },
        {
          key: "transaction_history",
          name: "Transaction History",
          path: "/user/app/account/transactions",
          icon: BarChart3,
        },
      ],
    },
    {
      key: "join_whatsapp_group",
      name: "Join WhatsApp Group",
      icon: FaWhatsapp,
      path: "https://chat.whatsapp.com/BtcHdUM5CT3953nLHajCQR?mode=wwt",
    },
    {
      key: "admin_panel",
      name: "Admin Panel",
      icon: PersonIcon,
      path: AppRoutes.adminDashboard,
    },
  ];

  return {
    BrandColors,
    navItems,
  };
};

export default useConstants;
