import React, { useEffect, useState } from "react";

import ClassroomHeader from "../../components/Instructor/Classroom/ClassroomHeader";
import ClassroomCard from "../../components/Instructor/Classroom/ClassroomCard";
import axiosClient from "../../../utils/axios-client";
import StudentClassroomModal from "../../components/Student/StudentClassroomModal";

export default function StudentClassroom() {
  const [classroomData, setClassroomData] = useState([]);
  // const [isEditting, setIsEditting] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const closeRef = useRef();
  // const onEditRef = useRef();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get("/student/classes");
      setClassroomData(response.data);
      //console.log(response.data);
    } catch (error) {
      console.log("Error in fetching Classroom Data", error);
    } finally {
      setIsLoading(false);
    }
  };


  // const handleEdit = (classroom) => {
  //   if (classroom) {
  //     setIsEditting(classroom);
  //     onEditRef.current.click();
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <StudentClassroomModal onRefresh={fetchData} />
      <ClassroomHeader />
      <ClassroomCard classroomData={classroomData} isLoading={isLoading} fetchDataa={fetchData}/>
    </>
  );
}
