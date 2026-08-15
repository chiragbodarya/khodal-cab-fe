import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout, AdminLayout } from '../components/layout';
import { Home } from '../pages/Home';
import { Vehicles } from '../pages/Vehicles';
import { TravelPlans } from '../pages/TravelPlans';
import { Blogs } from '../pages/Blogs';
import { Contact } from '../pages/Contact';
import { Gallery } from '../pages/Gallery';
import { AdminLogin } from '../pages/AdminLogin';
import { Dashboard as AdminDashboard } from '../pages/admin/Dashboard';
import { ManageFleet } from '../pages/admin/ManageFleet';
import { ManagePlans } from '../pages/admin/ManagePlans';
import { ManageBlogs } from '../pages/admin/ManageBlogs';
import { ManageGallery } from '../pages/admin/ManageGallery';
import { NotFound } from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/vehicles',
        element: <Vehicles />,
      },
      {
        path: '/plans',
        element: <TravelPlans />,
      },
      {
        path: '/blogs',
        element: <Blogs />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/gallery',
        element: <Gallery />,
      },
      {
        path: '/backstage/login',
        element: <AdminLogin />,
      },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: '/backstage/dashboard',
        element: <AdminDashboard />,
      },
      {
        path: '/backstage/fleet',
        element: <ManageFleet />,
      },
      {
        path: '/backstage/plans',
        element: <ManagePlans />,
      },
      {
        path: '/backstage/blogs',
        element: <ManageBlogs />,
      },
      {
        path: '/backstage/gallery',
        element: <ManageGallery />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
