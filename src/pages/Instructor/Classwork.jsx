import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavigationTabs from "../../components/Instructor/Classroom/ClassroomView/NavigationTabs";
import Dropdown from "../../components/Instructor/Classroom/Classwork/Dropdown";
import EmptyState from "../../components/Instructor/Classroom/Classwork/EmptyState";
import axiosClient from "../../../utils/axios-client";

export default function Classwork() {
  const [activeTab, setActiveTab] = useState("stream");
  const { id } = useParams();
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStatus, setQuizStatus] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [materialsRes, quizRes] = await Promise.all([
          axiosClient(`/classroom/${id}/materials`),
          axiosClient(`/classroom/getStatus/${id}`),
        ]);
        setMaterials(materialsRes.data);
        setQuizStatus(quizRes.data.status);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="min-vh-100 bg-light">
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        paramsId={id}
      />

      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="text-end mb-4">

              {quizStatus && <Dropdown />}
            </div>
            <EmptyState materials={materials} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
