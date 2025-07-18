import { useEffect, useState } from "react";
import React from "react";
import LeftSidebar from "../../components/Instructor/Classroom/ClassroomView/LeftSidebar";
import ViewHeader from "../../components/Instructor/Classroom/ClassroomView/ViewHeader";
import NavigationTabs from "../../components/Instructor/Classroom/ClassroomView/NavigationTabs";
import MainContent from "../../components/Instructor/Classroom/ClassroomView/MainContent";
import { useParams } from "react-router-dom";
import axiosClient from "../../../utils/axios-client";

export default function ClassroomView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("stream");
  const [classCode, setClassCode] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosClient.get(`/classroom/${id}`);
        setClassCode(response.data.data);
      } catch (error) {
        console.log("Error Getting Data: ", error);
      }
    };

    getData();
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} paramsId={id}/>

      <div className="container-fluid p-4">
        <ViewHeader classroomName={classCode.class_name} subject={classCode.subject} />

        <div className="row">
          <LeftSidebar class_code={classCode.section_code} />
          <MainContent />
        </div>
      </div>
    </div>
  );
}
