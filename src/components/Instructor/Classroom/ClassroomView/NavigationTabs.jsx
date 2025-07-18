import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

export default function NavigationTabs({paramsId}) {
  const location = useLocation();

  const tabs = [
    { id: "stream", label: "Stream", path: `/instructor/classrooms/${paramsId}` },
    { id: "classwork", label: "Classwork", path: `/instructor/classwork/${paramsId}` },
    { id: "people", label: "People", path: `/instructor/people/${paramsId}` },
    { id: "grades", label: "Grades", path: "/grades" },
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
                  className={`nav-link ${
                    isActive ? "active border-success text-success" : "text-muted"
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
