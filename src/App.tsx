import { useRoutes } from "react-router-dom";
import { DashboardLayout } from "@/layout/dashboard.layout";
import { routes } from "@/routes/routes";

function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <DashboardLayout />,
      children: routes,
    },
  ]);

  return <>{element}</>;
}

export default App;
