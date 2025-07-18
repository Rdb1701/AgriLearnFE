import React from "react";
import ClassCode from "./ClassCode";
import UpcomingSection from "./UpcomingSection";


export default function LeftSidebar({class_code}) {
  return (
    <div className="col-lg-3">
      <ClassCode class_code={class_code} />
      <UpcomingSection />
    </div>
  );
}
