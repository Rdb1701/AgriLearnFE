import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "./Layouts/DefaultLayout";
import GuestLayout from "./Layouts/GuestLayout";
import NotFound from "./pages/Auth/NotFound";
import Login from "./pages/Auth/Login";

import Dashboard from "./pages/Instructor/Dashboard";
import Students from "./pages/Instructor/Students";
import Classroom from "./pages/Instructor/Classroom";
import ClassroomView from "./pages/Instructor/ClassroomView";
import People from "./pages/Instructor/People";
import Classwork from "./pages/Instructor/Classwork";
import Tasks from "./pages/Instructor/Tasks";
import GoogleAuthSuccess from "./pages/Auth/GoogleAuthSuccess";
import MaterialsForm from "./pages/Instructor/MaterialsForm";
import MaterialView from "./pages/Instructor/MaterialView";
import MaterialsEditForm from "./pages/Instructor/MaterialsEditForm";
import QuizForm from "./pages/Instructor/QuizForm";
import QuizView from "./pages/Instructor/QuizView";
import StudentClassroom from "./pages/Student/StudentClassroom";
import StudentClassroomView from "./pages/Student/StudentClassroomView";
import StudentQuizView from "./pages/Student/StudentQuizView";
import StudentTasks from "./pages/Student/StudentTasks";
import Grades from "./pages/Instructor/Grades";
import ArchiveClassroom from "./pages/Instructor/ArchiveClassroom";
import Signup from "./pages/Auth/Signup";
import GameSimulation from "./pages/Student/GameSimulation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
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
        path: "/instructor/archive",
        element: <ArchiveClassroom />,
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
      {
        path: "/instructor/classwork/:id/materials",
        element: <MaterialsForm />,
      },
      {
        path: "/instructor/classwork/:id/materialsView/:material_id",
        element: <MaterialView />,
      },
      {
        path: "/instructor/classwork/:id/materialsEdit/:material_id",
        element: <MaterialsEditForm />,
      },
      {
        path: "/instructor/classwork/:id/quiz",
        element: <QuizForm />,
      },
      {
        path: "/instructor/classwork/:id/quizView/:created_at",
        element: <QuizView />,
      },
      {
        path: "/instructor/tasks/:id",
        element: <Tasks />,
      },
      
      {
        path: "/instructor/grades/:id",
        element: <Grades />,
      },
      //STUDENT ROUTES

      {
        path: "/student/class",
        element: <StudentClassroom />,
      },
      {
        path: "/student/classrooms/:id",
        element: <StudentClassroomView />,
      },
      {
        path: "/student/classwork/:id",
        element: <Classwork />,
      },
      {
        path: "/student/people/:id",
        element: <People />,
      },
      {
        path: "/student/tasks/:id",
        element: <StudentTasks />,
      },
      {
        path: "/student/classwork/:id/materialsView/:material_id",
        element: <MaterialView />,
      },
      {
        path: "/student/quiz/:id/quizView/:created_at/:quiz_code",
        element: <StudentQuizView />,
      },
    ],
  },
  {
    path: "/student/classroom/:id/simulation",
    element: <GameSimulation />,
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/google-auth-success",
        element: <GoogleAuthSuccess />,
      },

      {
        path: "/",
        element: <Navigate to="/login" />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
