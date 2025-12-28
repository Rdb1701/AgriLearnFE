import React, { useEffect, useState } from "react";

import ClassroomHeader from "../../components/Instructor/Classroom/ClassroomHeader";
import ClassroomCard from "../../components/Instructor/Classroom/ClassroomCard";
import ClassroomModal from "../../components/Instructor/Classroom/ClassroomModal";
import axiosClient from "../../../utils/axios-client";

export default function ArchiveClassroom() {
  const [classroomData, setClassroomData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get("/classroom/archive");
      setClassroomData(response.data);
      //console.log(response.data);
    } catch (error) {
      console.log("Error in fetching Classroom Data", error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ClassroomCard classroomData={classroomData} isLoading={isLoading} fetchClassroom={fetchData} description="Archives" />
    </>
  );
}
