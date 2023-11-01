import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import PermissionsPage from './pages/permissions/index';
import RolesPage from './pages/role/index';
import Users from './pages/user';
import Area from './pages/area';
import City from './pages/city';
import Property from './pages/property';
import PropertyAdd from './pages/property/PropertyAdd';
import PropertyEdit from './pages/property/PropertyEdit';
import Tasks from './pages/task';
import Logout from './pages/logout';
// import Test from './pages/property/test1'

// ----------------------------------------------------------------------

export default function Router() {
  const token = localStorage.getItem('lm_token');
  let isLoggedIn = false;
  if (token) {
    isLoggedIn = true;
  }

  const routes = useRoutes(isLoggedIn ? [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        // { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: '/permissions', element: <PermissionsPage /> },
        { path: '/roles', element: <RolesPage /> },
        { path: '/user', element: <Users /> },
        { path: '/city', element: <City /> },
        { path: '/area', element: <Area /> },
        { path: '/property', element: <Property /> },
        { path: '/property-add', element: <PropertyAdd /> },
        { path: '/property-edit', element: <PropertyEdit /> },
        // { path: '/test', element: <Test /> },
        { path: '/tasks', element: <Tasks /> },
        { path: '/logout', element: <Logout /> },
        { path: '*', element: <Navigate to="/app" replace /> },
      ],
    },
  ] : [{
    path: '/',
    element: <LoginPage />,
  }, {
    path: '/login',
    element: <LoginPage />,
  },
  { path: '404', element: <Page404 /> },
  { path: '*', element: <Navigate to="/" /> },]);

  return routes;
}
