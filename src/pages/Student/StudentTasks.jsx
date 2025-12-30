import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, XCircle, Target, Award } from "lucide-react";
import NavigationTabs from "../../components/Instructor/Classroom/ClassroomView/NavigationTabs";
import axiosClient from "../../../utils/axios-client";

export default function StudentTasks() {
  const { id } = useParams();
  const [roomTasks, setRoomTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");

  const fetchRoomTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`/room-tasks?room_id=${id}`);
      // Filter to only show active tasks for students
      const activeTasks = response.data.filter((task) => task.is_active);
      setRoomTasks(activeTasks);
    } catch (error) {
      console.error("Error fetching room tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTasks();
  }, [id]);

  return (
    <div className="min-vh-100 bg-light">
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        paramsId={id}
      />

      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <h4 className="fw-normal text-muted">
              <Target className="me-2" size={24} />
              Classroom Tasks
            </h4>
            <p className="text-muted small">
              Complete these tasks in the simulation to earn rewards!
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success"></div>
            <p className="text-muted mt-3">Loading tasks...</p>
          </div>
        ) : roomTasks.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="text-muted">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="mb-3"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <p className="mb-0">No tasks available for this classroom yet.</p>
                <p className="small">Check back later for new tasks!</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {roomTasks.map((roomTask) => (
              <div key={roomTask.id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div
                  className="card h-100 border-0 shadow-sm"
                  style={{ borderRadius: "12px" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0 fw-semibold">
                        {roomTask.task?.name || "Unknown Task"}
                      </h5>
                      <span
                        className="badge bg-success d-flex align-items-center gap-1"
                        style={{ fontSize: "12px" }}
                      >
                        <CheckCircle size={12} />
                        Active
                      </span>
                    </div>

                    <p className="card-text text-muted small mb-3">
                      {roomTask.task?.description || "No description available"}
                    </p>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-center">
                        <div
                          className="fw-bold text-primary"
                          style={{ fontSize: "1.5rem" }}
                        >
                          {roomTask.amount}
                        </div>
                        <small className="text-muted">Required</small>
                      </div>

                      <div className="text-center">
                        <div
                          className="fw-bold text-warning d-flex align-items-center justify-content-center gap-1"
                          style={{ fontSize: "1.5rem" }}
                        >
                          <Award size={20} />
                          {roomTask.reward}
                        </div>
                        <small className="text-muted">Points</small>
                      </div>
                    </div>
                  </div>

                  <div
                    className="card-footer bg-light border-0 text-center"
                    style={{
                      borderRadius: "0 0 12px 12px",
                    }}
                  >
                    <small className="text-muted">
                      Complete {roomTask.amount}x to earn {roomTask.reward} points
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
