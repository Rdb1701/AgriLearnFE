import { useEffect, useState } from "react";
import { useStateContext } from "../../../../contexts/ContextProvider";
import { CgNotes } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import axiosClient from "../../../../../utils/axios-client";
import { MdOutlineQuiz } from "react-icons/md";
import { encrypt } from "../../../../../utils/encryption";

export default function StreamContent({ materials, isLoading }) {
  const [activeTab, setActiveTab] = useState("materials");
  const { user } = useStateContext();
  const [quizData, setQuizData] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const encryptedID = encodeURIComponent(encrypt(id));

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    console.log("Fetching:", tabName);
    const fetchQuiz = async () => {
      try {
        const response = await axiosClient(`/quiz/${id}/quizzes`);
        console.log(response.data);
        setQuizData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuiz();
  };

  const handleClickMaterialView = (material_id) => {
    navigate(`/instructor/classwork/${encryptedID}/materialsView/${material_id}`);
  };

  const handleClickQuizView = (created_at) => {
    if (!id || !created_at) {
      console.error("Missing id or created_at", { id, created_at });
      return;
    }

    const encryptedDate = encodeURIComponent(encrypt(created_at));

    navigate(`/instructor/classwork/${encryptedID}/quizView/${encryptedDate}`);
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body text-center py-5">
        <div className="mb-4">
          <i
            className="fas fa-comments"
            style={{ fontSize: "4rem", color: "#28a745", opacity: 0.3 }}
          ></i>
          <style>{styles}</style>
          <div className="tab-navigation mb-4">
            <div className="d-flex justify-content-center gap-2">
              <button
                className={`tab-button ${
                  activeTab === "materials" ? "active" : ""
                }`}
                onClick={() => handleTabClick("materials")}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="me-2"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                Materials
              </button>
              <button
                className={`tab-button ${activeTab === "quiz" ? "active" : ""}`}
                onClick={() => handleTabClick("quiz")}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="me-2"
                >
                  <path d="M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8V5H4M4,19H8V15H4M4,14H8V10H4V14Z" />
                </svg>
                Quiz
              </button>
            </div>
          </div>
        </div>

        <>
          {activeTab === "materials" && materials.length > 0 ? (
            materials.map((mat) => (
              <div
                key={mat.id}
                className="material-card"
                onClick={() => handleClickMaterialView(mat.id)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <CgNotes className="fs-2 me-2 text-success" />
                  <div className="material-content">
                    <div className="material-title">
                      {user.name + " posted a new material: " + mat.title}
                    </div>
                    <div className="material-subtitle">
                      {" "}
                      {new Date(mat.created_at).toLocaleDateString("en-PH", {
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="material-arrow">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          ) : activeTab === "quiz" && quizData.length > 0 ? (
            quizData.map((quiz) => (
              <div
                key={quiz.quiz_title}
                className="material-card"
                onClick={() => handleClickQuizView(quiz.created_at)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <MdOutlineQuiz className="fs-2 me-2 text-success" />
                  <div className="material-content">
                    <div className="material-title">
                      {user.name + " posted a new quiz: " + quiz.quiz_title}
                    </div>
                    <div className="material-subtitle">
                      {" "}
                      {new Date(quiz.created_at).toLocaleDateString("en-PH", {
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="material-arrow">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="text-center ">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div
                      className="spinner-border text-success mb-3"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mb-0">Loading...</p>
                  </div>
                ) : (
                  // Materials empty state
                  <>
                    <div className="mb-4 position-relative d-inline-block computer-container">
                      <div className="position-relative mx-auto monitor">
                        <div className="position-absolute top-50 start-50 translate-middle screen"></div>
                      </div>
                      <div className="mx-auto monitor-stand"></div>
                      <div className="mx-auto monitor-base"></div>
                      <div className="mx-auto mt-2 keyboard"></div>
                      <div className="position-absolute mouse"></div>
                      <div className="position-absolute character">
                        <div className="mx-auto mb-1 character-head"></div>
                        <div className="mx-auto character-body"></div>
                        <div className="position-absolute character-arm-left"></div>
                        <div className="position-absolute character-arm-right"></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h5 className="mb-3">
                        This is where you can talk to your class
                      </h5>
                      <p className="text-muted mb-4">
                        Use the stream to share announcements, post assignments,
                        and respond to student questions
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </>
      </div>
    </div>
  );
}

const styles = `
 /* Tab Navigation Styles */
    .tab-navigation {
      border-bottom: 1px solid #e9ecef;
      padding-bottom: 1rem;
    }
    
    .tab-button {
      background: transparent;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      color: #6c757d;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      font-size: 0.95rem;
    }
    
    .tab-button:hover {
      background: #f8f9fa;
      border-color: #198754;
      color: #198754;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(25, 135, 84, 0.15);
    }
    
    .tab-button.active {
      background: linear-gradient(135deg, #198754, #157347);
      border-color: #198754;
      color: white;
      box-shadow: 0 4px 12px rgba(25, 135, 84, 0.25);
    }
    
    .tab-button.active:hover {
      background: linear-gradient(135deg, #157347, #0f5132);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(25, 135, 84, 0.3);
    }
      /* Quiz Empty State */
    .quiz-container {
      width: 200px;
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      cursor: pointer;
    }
    
    .quiz-container:hover {
      transform: scale(1.05);
    }
    
    .quiz-icon {
      color: #198754;
      transition: all 0.3s ease;
      opacity: 0.7;
    }
    
    .quiz-container:hover .quiz-icon {
      opacity: 1;
      transform: rotate(5deg);
    }

    /* Material card styles */
    .material-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      margin-bottom: 0.75rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    }
    
    .material-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #198754, #198754);
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    
    .material-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
      border-color: #198754;
      background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
    }
    
    .material-card:hover::before {
      transform: translateX(0);
    }
    
    .material-card:active {
      transform: translateY(-2px);
      transition: all 0.15s ease;
    }
    
    .material-content {
      flex: 1;
      text-align: left;
    }
    
    .material-title {
      font-weight: 600;
      font-size: 1rem;
      color: #212529;
      margin-bottom: 0.25rem;
      transition: color 0.3s ease;
    }
    
    .material-card:hover .material-title {
      color: #198754;
    }
    
    .material-subtitle {
      font-size: 0.875rem;
      color: #6c757d;
      transition: color 0.3s ease;
    }
    
    .material-card:hover .material-subtitle {
      color: #495057;
    }
    
    .material-arrow {
      color: #adb5bd;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
    }
    
    .material-card:hover .material-arrow {
      color: #198754;
      transform: translateX(4px);
    }
    
    /* Computer illustration styles with hover effects */
    .computer-container { 
      width: 200px; 
      height: 140px; 
      transition: transform 0.3s ease;
      cursor: pointer;
    }
    
    .computer-container:hover {
      transform: scale(1.05);
    }
    
    .monitor { 
      width: 120px; 
      height: 80px; 
      background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%); 
      border: 3px solid #6c757d; 
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    
    .computer-container:hover .monitor {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-color: #495057;
      box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
    }
    
    .screen { 
      width: 100px; 
      height: 60px; 
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    
    .computer-container:hover .screen {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    }
`;
