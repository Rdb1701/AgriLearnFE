import React, { useEffect, useRef, useState } from "react";

import ClassroomHeader from "../../components/Instructor/Classroom/ClassroomHeader";
import ClassroomCard from "../../components/Instructor/Classroom/ClassroomCard";
import ClassroomModal from "../../components/Instructor/Classroom/ClassroomModal";
import axiosClient from "../../../utils/axios-client";

export default function Classroom() {
  const [classroomData, setClassroomData] = useState([]);
  const [isEditting, setIsEditting] = useState([]);
  const closeRef = useRef();
  const onEditRef = useRef();

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/classroom");
      setClassroomData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error in fetching Classroom Data", error);
    }
  };

  const handleSubmit = async (payload) => {
    try {
      if (!payload.id) {
        const response = await axiosClient.post("/classroom", payload);
        swal("Successfully Added!", "", "success");
        closeRef.current.click();
        fetchData();
        console.log(response.data);
      }else{
        const response = await axiosClient.put(`/classroom/${payload.id}`, payload);
        swal("Successfully Udpated!", "", "success");
        closeRef.current.click();
        fetchData();
      }
    } catch (error) {
      // setErrors(error.response.data.errors);
      console.log("Error on Adding Data: ", error);

      //Returning the Errors to the inputs if there are errors
      if (error.response) {
        return error.response.data.errors;
      }
    }
  };

  const handleEdit = (classroom) => {
    if (classroom) {
      setIsEditting(classroom);
      onEditRef.current.click();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ClassroomModal
        onSubmit={handleSubmit}
        closeRef={closeRef}
        edittingUser={isEditting}
      />
      <ClassroomHeader onEditRef={onEditRef} />
      <ClassroomCard classroomData={classroomData} onEdit={handleEdit} />
    </>
  );
}
