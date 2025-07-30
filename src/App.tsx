import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardContent from "./components/DashboardContent";
import ProtectedRoutes from "./components/ProtectedRoutes";
import DashboardLayout from "./components/DashboardLayout";
import PublicRoute from "./components/PublicRoutes";
import ResetPassword from "./pages/ResetPassword";
import Blog from "./pages/blog/Blog";
import AddBlog from "./pages/addBlog/AddBlog";
import EditBlog from "./pages/editBlog/EditBlog";
import UsersPage from "./components/UsersPage";
import AddUser from "./pages/users/AddUsers";
import UserList from "./pages/users/Users";
import AdminHomePage from "./pages/home/AdminHomePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <DashboardLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<Navigate to="/dashboard/home" replace />} />
            <Route path="home" element={<AdminHomePage />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="blog" element={<Blog />} />
            <Route path="add-blog" element={<AddBlog />} />
            <Route path="users" element={<UserList />} />
            <Route path="add-users" element={<AddUser />} />
            <Route path="edit-blog/:id" element={<EditBlog />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
