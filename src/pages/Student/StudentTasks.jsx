import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, Clock, Target, Award, TrendingUp } from "lucide-react";
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
      const response = await axiosClient.get(`/classroom/${id}/room-tasks`);
      // Flatten the nested array structure and filter active tasks
      const flattenedTasks = response.data
        .flat()
        .filter((task) => task.is_active);
      setRoomTasks(flattenedTasks);
    } catch (error) {
      console.error("Error fetching room tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTasks();
  }, [id]);

  // Helper function to get progress from user_room_tasks
  const getProgress = (roomTask) => {
    const userTask = roomTask.user_room_tasks?.[0];
    const score = userTask?.score || 0;
    const amount = roomTask.amount || 1;
    const percentage = Math.min((score / amount) * 100, 100);
    const isCompleted = userTask?.is_completed === 1;
    return { score, amount, percentage, isCompleted };
  };

  // Get progress bar color based on percentage
  const getProgressColor = (percentage, isCompleted) => {
    if (isCompleted) return "#198754"; // green
    if (percentage >= 75) return "#198754"; // green
    if (percentage >= 50) return "#0d6efd"; // blue
    if (percentage >= 25) return "#ffc107"; // yellow
    return "#6c757d"; // gray
  };

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
            <h4 className="fw-normal text-muted d-flex align-items-center">
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
            {roomTasks.map((roomTask) => {
              const { score, amount, percentage, isCompleted } = getProgress(roomTask);
              const progressColor = getProgressColor(percentage, isCompleted);

              return (
                <div key={roomTask.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{ 
                      borderRadius: "12px",
                      borderLeft: isCompleted ? "4px solid #198754" : "none"
                    }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0 fw-semibold">
                          {roomTask.task?.name || "Unknown Task"}
                        </h5>
                        {isCompleted ? (
                          <span
                            className="badge bg-success d-flex align-items-center gap-1"
                            style={{ fontSize: "12px" }}
                          >
                            <CheckCircle size={12} />
                            Completed
                          </span>
                        ) : (
                          <span
                            className="badge bg-warning text-dark d-flex align-items-center gap-1"
                            style={{ fontSize: "12px" }}
                          >
                            <Clock size={12} />
                            In Progress
                          </span>
                        )}
                      </div>

                      <p className="card-text text-muted small mb-3">
                        {roomTask.task?.description || "No description available"}
                      </p>

                      {/* Progress Section */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted d-flex align-items-center gap-1">
                            <TrendingUp size={14} />
                            Progress
                          </small>
                          <small className="fw-bold" style={{ color: progressColor }}>
                            {score} / {amount}
                          </small>
                        </div>
                        <div 
                          className="progress" 
                          style={{ 
                            height: "8px", 
                            borderRadius: "4px",
                            backgroundColor: "#e9ecef"
                          }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: progressColor,
                              borderRadius: "4px",
                              transition: "width 0.3s ease"
                            }}
                            aria-valuenow={percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <div className="text-end mt-1">
                          <small className="text-muted">
                            {percentage.toFixed(0)}% complete
                          </small>
                        </div>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-center">
                          <div
                            className="fw-bold text-primary"
                            style={{ fontSize: "1.25rem" }}
                          >
                            {amount}
                          </div>
                          <small className="text-muted">Required</small>
                        </div>

                        <div className="text-center">
                          <div
                            className="fw-bold d-flex align-items-center justify-content-center gap-1"
                            style={{ 
                              fontSize: "1.25rem",
                              color: isCompleted ? "#198754" : "#ffc107"
                            }}
                          >
                            <Award size={18} />
                            {roomTask.reward}
                          </div>
                          <small className="text-muted">
                            {isCompleted ? "Earned" : "Points"}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
