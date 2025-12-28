import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useStateContext } from "../../../../contexts/ContextProvider";

export default function NavigationTabs({ paramsId }) {
  const location = useLocation();
  const { user } = useStateContext();

  const tabs = [
    {
      id: "stream",
      label: "Stream",
      path:
        user.role === "Instructor"
          ? `/instructor/classrooms/${paramsId}`
          : `/student/classrooms/${paramsId}`,
    },
    {
      id: "classwork",
      label: "Classwork",
      path:
        user.role === "Instructor"
          ? `/instructor/classwork/${paramsId}`
          : `/student/classwork/${paramsId}`,
    },
    {
      id: "people",
      label: "People",
      path:
        user.role === "Instructor"
          ? `/instructor/people/${paramsId}`
          : `/student/people/${paramsId}`,
    },
    user.role === "Instructor"
      ? { id: "grades", label: "Grades", path: `/instructor/grades/${paramsId}` }
      : {},
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid">
        <ul className="nav nav-tabs border-0">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;

            return (
              <li className="nav-item" key={tab.id}>
                <Link
                  to={tab.path}
                  className={`nav-link ${isActive
                    ? "active border-success text-success"
                    : "text-muted"
                    }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
