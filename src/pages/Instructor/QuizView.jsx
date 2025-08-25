import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../utils/axios-client";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import swal from "sweetalert";
import { decrypt } from "../../../utils/encryption";
import { useStateContext } from "../../contexts/ContextProvider";

// constants
const QUESTION_TYPES = [
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "true-false", label: "True or False" },
];

const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function QuizView() {
  const { id, created_at } = useParams(); // quiz id
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const {user} = useStateContext();

  const decryptedID = decrypt(decodeURIComponent(id));
  const decryptedDate = decrypt(decodeURIComponent(created_at));

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axiosClient.get(
          `/quiz/${decryptedID}/quizzes/${decryptedDate}`
        );

        setQuizTitle(data[0]?.quiz_title || ""); 

        setQuestions(
          data.map((q) => ({
            id: q.id,
            type: q.type || "multiple-choice",
            questionText: q.questions_text, 
            options: (() => {
              try {
                return JSON.parse(q.options); 
              } catch {
                return ["Option 1", "Option 2"]; // fallback
              }
            })(),
            correctAnswer: q.correct_answer,
            difficultyLevel: q.difficulty_level || "easy",
          }))
        );

        console.log(data);
      } catch (err) {
        console.error(err);
        console.log("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, created_at]);

  // Update quiz
  const updateQuiz = async () => {
    try {
      const payload = {
        quiz_title: quizTitle.trim(),
        classroom_id: decryptedID,
        created_by: user.id,
        questions: questions.map((q) => ({
          id: q.id,
          questions_text: q.questionText,
          options: q.options,
          correct_answer: q.correctAnswer,
          difficulty_level: q.difficultyLevel,
        })),
      };
      console.log(payload);
     // return;
      await axiosClient.put(`/quizzes/${decryptedID}`, payload);
      swal("Quiz updated successfully!","","success");
      navigate(-1); // go back
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update quiz");
    }
  };

  const handleDeleteAll = async (classroom_id, created_at) => {
    const confirm = await swal({
      title: "Are you sure?",
      text: "This will permanently delete all quizzes. This action cannot be undone.",
      icon: "warning",
      buttons: ["Cancel", "Yes, delete it!"],
      dangerMode: true,
    });

    if (!confirm) return;

    try {
      const response = await axiosClient.delete(
        `quiz/${classroom_id}/deleteAll/${created_at}`
      );

      if (response.status === 200) {
        swal("", "Successfully deleted quizzes", "success");
        navigate(`/instructor/classrooms/${classroom_id}`);
      }
    } catch (error) {
      console.log(error);
      swal("Error", "Something went wrong while deleting quizzes.", "error");
    }
  };

  if (loading)
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-success mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mb-0">Loading...</p>
      </div>
    );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <button
            className="btn p-2 me-2"
            onClick={() => window.history.back()}
          >
            <FaArrowLeft style={{ fontSize: "20px" }} />
          </button>
          <h2 className="mb-0">Edit Quiz</h2>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger"
            onClick={() => handleDeleteAll(decryptedID, decryptedDate)}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Quiz Title */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <label className="form-label fw-bold">Quiz Title</label>
          <input
            type="text"
            className="form-control form-control-lg"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, idx) => (
        <div key={q.id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold">Question {idx + 1}</h5>
              <span
                className={`badge ${
                  q.difficultyLevel === "easy"
                    ? "bg-success"
                    : q.difficultyLevel === "medium"
                    ? "bg-warning"
                    : "bg-danger"
                }`}
              >
                {q.difficultyLevel}
              </span>
            </div>

            {/* Question text */}
            <textarea
              className="form-control mb-3"
              value={q.questionText}
              onChange={(e) =>
                setQuestions(
                  questions.map((qq) =>
                    qq.id === q.id
                      ? { ...qq, questionText: e.target.value }
                      : qq
                  )
                )
              }
            />

            <div className="row">
              {/* Type */}
              <div className="col-md-6">
                <label className="form-label">Question Type</label>
                <select
                  className="form-select"
                  value={q.type}
                  onChange={(e) =>
                    setQuestions(
                      questions.map((qq) =>
                        qq.id === q.id ? { ...qq, type: e.target.value } : qq
                      )
                    )
                  }
                >
                  {QUESTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="col-md-6">
                <label className="form-label">Difficulty</label>
                <select
                  className="form-select"
                  value={q.difficultyLevel}
                  onChange={(e) =>
                    setQuestions(
                      questions.map((qq) =>
                        qq.id === q.id
                          ? { ...qq, difficultyLevel: e.target.value }
                          : qq
                      )
                    )
                  }
                >
                  {DIFFICULTY_LEVELS.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Options */}
            <div className="mt-3">
              <label className="form-label fw-bold">Options</label>
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="d-flex align-items-center mb-2">
                  <input
                    type="radio"
                    className="form-check-input me-2"
                    checked={q.correctAnswer === opt}
                    onChange={() =>
                      setQuestions(
                        questions.map((qq) =>
                          qq.id === q.id ? { ...qq, correctAnswer: opt } : qq
                        )
                      )
                    }
                  />
                  <span className="badge bg-secondary me-2">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  {q.type === "true-false" ? (
                    <span className="form-control-plaintext">{opt}</span>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value={opt}
                      onChange={(e) =>
                        setQuestions(
                          questions.map((qq) =>
                            qq.id === q.id
                              ? {
                                  ...qq,
                                  options: qq.options.map((oo, i) =>
                                    i === optIdx ? e.target.value : oo
                                  ),
                                }
                              : qq
                          )
                        )
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Update Button */}
      <div className="text-end">
        <button className="btn btn-success" onClick={updateQuiz}>
          <i className="bi bi-save me-2"></i> Update Quiz
        </button>
      </div>
    </div>
  );
}
