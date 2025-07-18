import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "./Layouts/DefaultLayout";
import GuestLayout from "./Layouts/GuestLayout";
import NotFound from "./pages/Auth/NotFound";
import Login from "./pages/Auth/Login";
import Users from "./pages/User/Users";
import Dashboard from "./pages/Instructor/Dashboard";
import Students from "./pages/Instructor/Students";
import Classroom from "./pages/Instructor/Classroom";
import ClassroomView from "./pages/Instructor/ClassroomView";
import People from "./pages/Instructor/People";
import Classwork from "./pages/Instructor/Classwork";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/instructor/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/instructor/students",
        element: <Students />,
      },
      {
        path: "/instructor/classrooms",
        element: <Classroom />,
      },
      {
        path: "/instructor/classrooms/:id",
        element: <ClassroomView />,
      },
      {
        path: "/instructor/people/:id",
        element: <People />,
      },
      {
        path: "/instructor/classwork/:id",
        element: <Classwork />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
