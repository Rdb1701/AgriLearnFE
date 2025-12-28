import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../utils/axios-client";
import NavigationTabs from "../../components/Instructor/Classroom/ClassroomView/NavigationTabs";

export default function Grades() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("grades");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [scoresRes, quizzesRes] = await Promise.all([
          axiosClient.get(`/quiz-scores/classroom/${id}`),
          axiosClient.get(`/quiz/${id}/quizzes`),
        ]);

        const sortedQuizzes = quizzesRes.data.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        const grouped = {};
        scoresRes.data.data.forEach((s) => {
          if (!grouped[s.student_id]) {
            grouped[s.student_id] = {
              student_id: s.student_id,
              name: s.student?.name || "Unknown Student",
              scores: {},
            };
          }
          grouped[s.student_id].scores[s.quiz_code] = s;
        });

        setStudents(Object.values(grouped));
        setQuizzes(sortedQuizzes);

      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getStudentScore = (student, quizCode) => {
    const record = student.scores?.[quizCode];
    if (!record) return null;
    return {
      correct: record.correct_answers,
      total: record.total_questions,
      percentage: ((record.correct_answers / record.total_questions) * 100).toFixed(0)
    };
  };

  const sortedStudents = [...students].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="min-vh-100 bg-light">
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        paramsId={id}
      />

      <div className="container-fluid py-4 px-4">
        <div 
          className="card border-0 shadow-sm" 
          style={{ 
            borderRadius: "12px",
            overflow: "hidden"
          }}
        >
          <div className="card-body p-0">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success"></div>
                <p className="text-muted mt-3">Loading grades...</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table 
                  className="table mb-0" 
                  style={{ 
                    borderCollapse: "separate",
                    borderSpacing: 0
                  }}
                >
                  <thead>
                    <tr style={{ background: "#198754" }}>
                      <th
                        className="text-white fw-semibold"
                        style={{
                          minWidth: "260px",
                          position: "sticky",
                          left: 0,
                          zIndex: 10,
                          background: "#198754",
                          padding: "18px 24px",
                          borderBottom: "none",
                          fontSize: "13px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}
                      >
                        Student Name
                      </th>

                      {quizzes.map((quiz, idx) => (
                        <th
                          key={quiz.quiz_code}
                          className="text-white text-center"
                          style={{
                            minWidth: "140px",
                            padding: "18px 16px",
                            background: "#198754",
                            borderBottom: "none",
                            borderLeft: idx === 0 ? "1px solid rgba(255,255,255,0.15)" : "none"
                          }}
                        >
                          <div className="d-flex flex-column align-items-center gap-1">
                            <div 
                              className="fw-semibold" 
                              style={{ 
                                fontSize: "13px",
                                lineHeight: "1.3"
                              }}
                            >
                              {quiz.quiz_title}
                            </div>
                            <div 
                              style={{ 
                                fontSize: "11px",
                                opacity: 0.85,
                                fontWeight: 500
                              }}
                            >
                              {new Date(quiz.created_at).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>

                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {sortedStudents.map((student, idx) => (
                      <tr 
                        key={student.student_id}
                        style={{
                          background: idx % 2 === 0 ? "white" : "#f8f9fa",
                          transition: "background 0.15s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f1f8f4"}
                        onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? "white" : "#f8f9fa"}
                      >
                        <td
                          style={{
                            position: "sticky",
                            left: 0,
                            zIndex: 5,
                            background: "inherit",
                            padding: "14px 24px",
                            borderBottom: "1px solid #dee2e6"
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                student.name
                              )}&background=random`}
                              alt={student.name}
                              className="rounded-circle"
                              width="40"
                              height="40"
                              style={{ 
                                border: "2px solid #e9ecef",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.06)"
                              }}
                            />
                            <span 
                              className="fw-medium" 
                              style={{ 
                                fontSize: "14px",
                                color: "#212529"
                              }}
                            >
                              {student.name}
                            </span>
                          </div>
                        </td>

                        {quizzes.map((quiz, qIdx) => {
                          const score = getStudentScore(student, quiz.quiz_code);
                          return (
                            <td
                              key={quiz.quiz_code}
                              className="text-center"
                              style={{
                                padding: "14px",
                                borderBottom: "1px solid #dee2e6",
                                borderLeft: qIdx === 0 ? "1px solid #dee2e6" : "none"
                              }}
                            >
                              {score ? (
                                <div className="d-flex flex-column align-items-center">
                                  <div 
                                    className="fw-medium"
                                    style={{ 
                                      fontSize: "14px",
                                      color: "#212529"
                                    }}
                                  >
                                    {score.correct}/{score.total}
                                  </div>
                                </div>
                              ) : (
                                <span 
                                  style={{ 
                                    fontSize: "14px",
                                    color: "#adb5bd"
                                  }}
                                >
                                  —
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Class Summary */}
        {!isLoading && students.length > 0 && (
          <div 
            className="mt-3 px-3 py-2 bg-white rounded-3 shadow-sm"
            style={{ 
              fontSize: "14px",
              color: "#6c757d",
              display: "inline-block"
            }}
          >
            <strong>{students.length}</strong> students
          </div>
        )}
      </div>
    </div>
  );
}