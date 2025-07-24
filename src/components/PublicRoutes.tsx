import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();

  // If logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return children;
};

export default PublicRoute;
