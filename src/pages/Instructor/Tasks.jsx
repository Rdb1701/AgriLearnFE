import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Users, ListTodo, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import NavigationTabs from "../../components/Instructor/Classroom/ClassroomView/NavigationTabs";
import TaskModal from "../../components/Instructor/Classroom/Tasks/TaskModal";
import axiosClient from "../../../utils/axios-client";
import swal from "sweetalert";

export default function Tasks() {
  const { id } = useParams();
  const [roomTasks, setRoomTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [studentsProgress, setStudentsProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [innerTab, setInnerTab] = useState("manage"); // "manage" or "progress"
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({});

  const fetchRoomTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`/room-tasks?room_id=${id}`);
      setRoomTasks(response.data);
    } catch (error) {
      console.error("Error fetching room tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const response = await axiosClient.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchStudentsProgress = async () => {
    setIsLoadingProgress(true);
    try {
      const response = await axiosClient.get(`/classroom/${id}/room-tasks/students`);
      setStudentsProgress(response.data);
    } catch (error) {
      console.error("Error fetching students progress:", error);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  useEffect(() => {
    fetchRoomTasks();
    fetchAllTasks();
  }, [id]);

  useEffect(() => {
    if (innerTab === "progress") {
      fetchStudentsProgress();
    }
  }, [innerTab, id]);

  const handleSubmit = async (payload) => {
    try {
      if (payload.id) {
        // Update existing room task
        await axiosClient.put(`/room-tasks/${payload.id}`, payload);
        swal("Success", "Task updated successfully!", "success");
      } else {
        // Create new room task
        await axiosClient.post("/room-tasks", {
          ...payload,
          room_id: id,
        });
        swal("Success", "Task added successfully!", "success");
      }
      fetchRoomTasks();
      setEditingTask(null);
      return null;
    } catch (error) {
      console.error("Error saving task:", error);
      if (error.response?.data?.errors) {
        return error.response.data.errors;
      }
      swal("Error", "Failed to save task", "error");
      return null;
    }
  };

  const handleDelete = async (taskId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this task!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axiosClient.delete(`/room-tasks/${taskId}`);
          swal("Success", "Task deleted successfully!", "success");
          fetchRoomTasks();
        } catch (error) {
          console.error("Error deleting task:", error);
          swal("Error", "Failed to delete task", "error");
        }
      }
    });
  };

  const handleEdit = (roomTask) => {
    setEditingTask(roomTask);
  };

  const handleToggleActive = async (roomTask) => {
    try {
      await axiosClient.put(`/room-tasks/${roomTask.id}`, {
        is_active: !roomTask.is_active,
      });
      fetchRoomTasks();
    } catch (error) {
      console.error("Error toggling task status:", error);
      swal("Error", "Failed to update task status", "error");
    }
  };

  const handleCloseModal = () => {
    setEditingTask(null);
  };

  const toggleExpandTask = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "#198754";
    if (percentage >= 75) return "#198754";
    if (percentage >= 50) return "#0d6efd";
    if (percentage >= 25) return "#ffc107";
    return "#6c757d";
  };

  return (
    <>
      <TaskModal
        onSubmit={handleSubmit}
        editingTask={editingTask}
        tasks={tasks}
        onClose={handleCloseModal}
      />

      <div className="min-vh-100 bg-light">
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          paramsId={id}
        />

        <div className="container py-4">
          {/* Inner Tab Navigation */}
          <ul className="nav nav-pills mb-4">
            <li className="nav-item">
              <button
                className={`nav-link d-flex align-items-center gap-2 ${innerTab === "manage" ? "active bg-success" : "text-muted"}`}
                onClick={() => setInnerTab("manage")}
              >
                <ListTodo size={18} />
                Manage Tasks
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link d-flex align-items-center gap-2 ${innerTab === "progress" ? "active bg-success" : "text-muted"}`}
                onClick={() => setInnerTab("progress")}
              >
                <Users size={18} />
                Student Progress
              </button>
            </li>
          </ul>

          {/* Manage Tasks Tab */}
          {innerTab === "manage" && (
            <div className="card">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 fw-normal">Room Tasks</h5>
                  <button
                    className="btn btn-success btn-sm d-flex align-items-center gap-2"
                    data-bs-target="#task_modal"
                    data-bs-toggle="modal"
                    onClick={() => setEditingTask(null)}
                  >
                    <Plus size={16} />
                    Add Task
                  </button>
                </div>
              </div>

              <div className="card-body p-0">
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success"></div>
                    <p className="text-muted mt-3">Loading tasks...</p>
                  </div>
                ) : roomTasks.length === 0 ? (
                  <div className="text-center py-5">
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
                      <p className="mb-0">No tasks assigned to this classroom yet.</p>
                      <p className="small">Click "Add Task" to get started.</p>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4">Task Name</th>
                          <th>Description</th>
                          <th className="text-center">Amount</th>
                          <th className="text-center">Reward</th>
                          <th className="text-center">Status</th>
                          <th className="text-center pe-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roomTasks.map((roomTask) => (
                          <tr key={roomTask.id}>
                            <td className="ps-4 fw-medium">
                              {roomTask.task?.name || "Unknown Task"}
                            </td>
                            <td className="text-muted">
                              {roomTask.task?.description || "-"}
                            </td>
                            <td className="text-center">{roomTask.amount}</td>
                            <td className="text-center">
                              <span className="badge bg-warning text-dark">
                                {roomTask.reward} pts
                              </span>
                            </td>
                            <td className="text-center">
                              <button
                                className={`btn btn-sm ${
                                  roomTask.is_active
                                    ? "btn-outline-success"
                                    : "btn-outline-secondary"
                                }`}
                                onClick={() => handleToggleActive(roomTask)}
                                title={roomTask.is_active ? "Active" : "Inactive"}
                              >
                                {roomTask.is_active ? (
                                  <CheckCircle size={16} />
                                ) : (
                                  <XCircle size={16} />
                                )}
                              </button>
                            </td>
                            <td className="text-center pe-4">
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(roomTask)}
                                  data-bs-target="#task_modal"
                                  data-bs-toggle="modal"
                                  title="Edit"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(roomTask.id)}
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Student Progress Tab */}
          {innerTab === "progress" && (
            <div className="card">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 fw-normal d-flex align-items-center gap-2">
                    <TrendingUp size={20} />
                    Student Progress by Task
                  </h5>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={fetchStudentsProgress}
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <div className="card-body p-0">
                {isLoadingProgress ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success"></div>
                    <p className="text-muted mt-3">Loading student progress...</p>
                  </div>
                ) : studentsProgress.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="text-muted">
                      <Users size={64} strokeWidth={1} className="mb-3" />
                      <p className="mb-0">No task progress data available.</p>
                      <p className="small">Students haven't started any tasks yet.</p>
                    </div>
                  </div>
                ) : (
                  <div className="accordion accordion-flush" id="progressAccordion">
                    {studentsProgress.map((taskProgress) => {
                      const isExpanded = expandedTasks[taskProgress.id];
                      const progressColor = getProgressColor(taskProgress.completion_rate);

                      return (
                        <div className="accordion-item" key={taskProgress.id}>
                          <div
                            className="accordion-header"
                            style={{ cursor: "pointer" }}
                            onClick={() => toggleExpandTask(taskProgress.id)}
                          >
                            <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light">
                              <div className="d-flex align-items-center gap-3">
                                <div>
                                  {isExpanded ? (
                                    <ChevronUp size={20} className="text-muted" />
                                  ) : (
                                    <ChevronDown size={20} className="text-muted" />
                                  )}
                                </div>
                                <div>
                                  <h6 className="mb-1 fw-semibold">
                                    {taskProgress.task?.name || "Unknown Task"}
                                  </h6>
                                  <small className="text-muted">
                                    {taskProgress.task?.description}
                                  </small>
                                </div>
                              </div>
                              <div className="d-flex align-items-center gap-4">
                                <div className="text-center">
                                  <div className="fw-bold" style={{ color: progressColor }}>
                                    {taskProgress.completed_count}/{taskProgress.total_students}
                                  </div>
                                  <small className="text-muted">Completed</small>
                                </div>
                                <div style={{ width: "120px" }}>
                                  <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">Completion</small>
                                    <small className="fw-bold" style={{ color: progressColor }}>
                                      {taskProgress.completion_rate}%
                                    </small>
                                  </div>
                                  <div
                                    className="progress"
                                    style={{ height: "6px", borderRadius: "3px" }}
                                  >
                                    <div
                                      className="progress-bar"
                                      style={{
                                        width: `${taskProgress.completion_rate}%`,
                                        backgroundColor: progressColor,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <span className="badge bg-warning text-dark">
                                    {taskProgress.reward} pts
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="accordion-body p-0">
                              <table className="table table-sm mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th className="ps-4">Student</th>
                                    <th>Email</th>
                                    <th className="text-center">Progress</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center pe-4">Completed At</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {taskProgress.students_progress.map((student) => {
                                    const studentProgress = student.progress;
                                    const studentPercentage = Math.min(
                                      (studentProgress.score / taskProgress.amount) * 100,
                                      100
                                    );
                                    const studentColor = getProgressColor(studentPercentage);
                                    const isCompleted = studentProgress.is_completed === 1 || studentProgress.is_completed === true;

                                    return (
                                      <tr key={student.user.id}>
                                        <td className="ps-4">
                                          <div className="d-flex align-items-center gap-2">
                                            <div
                                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                              style={{
                                                width: "32px",
                                                height: "32px",
                                                backgroundColor: "#6c757d",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {student.user.name?.charAt(0).toUpperCase() || "?"}
                                            </div>
                                            <span className="fw-medium">{student.user.name}</span>
                                          </div>
                                        </td>
                                        <td className="text-muted">{student.user.email}</td>
                                        <td className="text-center">
                                          <div className="d-flex align-items-center justify-content-center gap-2">
                                            <div
                                              className="progress"
                                              style={{ width: "80px", height: "6px", borderRadius: "3px" }}
                                            >
                                              <div
                                                className="progress-bar"
                                                style={{
                                                  width: `${studentPercentage}%`,
                                                  backgroundColor: studentColor,
                                                }}
                                              ></div>
                                            </div>
                                            <small className="fw-bold" style={{ color: studentColor }}>
                                              {studentProgress.score}/{taskProgress.amount}
                                            </small>
                                          </div>
                                        </td>
                                        <td className="text-center">
                                          {isCompleted ? (
                                            <span className="badge bg-success d-inline-flex align-items-center gap-1">
                                              <CheckCircle size={12} />
                                              Completed
                                            </span>
                                          ) : (
                                            <span className="badge bg-secondary d-inline-flex align-items-center gap-1">
                                              <XCircle size={12} />
                                              In Progress
                                            </span>
                                          )}
                                        </td>
                                        <td className="text-center pe-4 text-muted">
                                          {studentProgress.completed_at
                                            ? new Date(studentProgress.completed_at).toLocaleString()
                                            : "-"}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
