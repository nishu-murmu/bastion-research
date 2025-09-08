import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { routes } from "./routes";
import ModalsLayout from "./layouts/ModalsLayout";
import RouteAnalytics from "./components/RouteAnalytics";

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

function App() {
  return (
    <Router>
      <RouteAnalytics />
      <AppRoutes />
      <ModalsLayout />
      <Toaster />
    </Router>
  );
}

export default App;
