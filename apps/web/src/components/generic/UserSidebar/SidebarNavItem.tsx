const SidebarNavItem = ({
  item,
  isCollapsed,
  isActive,
  user,
  subscription,
  isAdmin,
  setShowPricing,
  profile,
  toast,
  setIsMobileOpen,
  navigate,
  location,
}) => {
  return (
    <div
      onClick={() => {
        if (
          !user ||
          !subscription ||
          (!subscription.is_premium &&
            !isAdmin &&
            (item.name === "Premium Webinars" ||
              item.name === "Scratch Pad Newsletter"))
        ) {
          setShowPricing(true);
          return;
        }
        if (
          !profile.is_premium &&
          (item.name.toLowerCase().includes("scratch pad") ||
            item.path.includes("/scratch-pad"))
        ) {
          toast.info("Upgrade to access Scratch Pad");
          return;
        }
        setIsMobileOpen(false);
        navigate(item.path);
      }}
      title={isCollapsed ? item.name : undefined}
      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full ${
        isCollapsed ? "justify-center" : ""
      } ${
        isActive ? "bg-white text-blue-900" : "text-gray-200 hover:bg-red-900"
      } cursor-pointer`}
      role="button"
      tabIndex={0}
    >
      <item.icon className="h-5 w-5" />
      {!isCollapsed && <span className="ml-3">{item.name}</span>}
    </div>
  );
};

export default SidebarNavItem;
