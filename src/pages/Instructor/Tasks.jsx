import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import NavigationTabs from "../../components/Instructor/Classroom/ClassroomView/NavigationTabs";
import TaskModal from "../../components/Instructor/Classroom/Tasks/TaskModal";
import axiosClient from "../../../utils/axios-client";
import swal from "sweetalert";

export default function Tasks() {
  const { id } = useParams();
  const [roomTasks, setRoomTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [editingTask, setEditingTask] = useState(null);

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

  useEffect(() => {
    fetchRoomTasks();
    fetchAllTasks();
  }, [id]);

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
        </div>
      </div>
    </>
  );
}
