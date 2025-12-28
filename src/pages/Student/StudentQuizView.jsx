import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../utils/axios-client";
import { FaArrowLeft } from "react-icons/fa";
import swal from "sweetalert";
import { decrypt } from "../../../utils/encryption";
import { useStateContext } from "../../contexts/ContextProvider";

export default function StudentQuizView() {
  const { id, created_at, quiz_code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [isPastDue, setIsPastDue] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60); // 1 minute default
  const [timePerQuestion] = useState(60); // 1 minute per question
  const { user } = useStateContext();

  const decryptedID = decrypt(decodeURIComponent(id));
  const decryptedDate = decrypt(decodeURIComponent(created_at));
  const quizCode = decrypt(decodeURIComponent(quiz_code));

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axiosClient.get(
          `/quiz/${decryptedID}/quizzes/${decryptedDate}`
        );

        setQuizTitle(data[0]?.quiz_title || "");
        
        // Check due date
        const dueDateValue = data[0]?.due_date;
        if (dueDateValue) {
          setDueDate(new Date(dueDateValue));
          const now = new Date();
          setIsPastDue(now > new Date(dueDateValue));
        }

        setQuestions(
          data.map((q) => ({
            id: q.id,
            type: q.type || "multiple-choice",
            questionText: q.questions_text,
            options: (() => {
              try {
                return JSON.parse(q.options);
              } catch {
                return ["Option 1", "Option 2"];
              }
            })(),
            correctAnswer: q.correct_answer,
            difficultyLevel: q.difficulty_level || "easy",
          }))
        );
      } catch (err) {
        console.error(err);
        swal("Error", "Failed to load quiz", "error");
      } finally {
        setLoading(false);
      }
    };

    const checkUserQuiz = async () => {
      try {
        const { data } = await axiosClient.get(
          `/quiz/${decryptedID}/${quizCode}/user`,
          { params: { student_id: user.id } }
        );

        if (data.already_submitted) {
          // Parse the answers if they're stored as JSON string
          let parsedAnswers = data.score.answers;
          if (typeof parsedAnswers === 'string') {
            try {
              parsedAnswers = JSON.parse(parsedAnswers);
            } catch (e) {
              console.error("Error parsing answers:", e);
              parsedAnswers = {};
            }
          }

          setAnswers(parsedAnswers || {});
          setScore(data.score.score);
          setSubmitted(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuiz();
    checkUserQuiz();
  }, [id, created_at]);

  // Timer effect
  useEffect(() => {
    if (submitted || isPastDue || loading) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up for this question - auto advance
          handleNextQuestion(true);
          return timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, submitted, isPastDue, loading]);

  const handleAnswerChange = (questionId, answer) => {
    // Prevent answering if past due or already submitted
    if (isPastDue || submitted) return;
    
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleNextQuestion = (autoAdvance = false) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Warn if no answer selected (unless auto-advancing due to timeout)
    if (!autoAdvance && !answers[currentQuestion?.id]) {
      swal({
        title: "No Answer Selected",
        text: "Are you sure you want to proceed without answering?",
        icon: "warning",
        buttons: ["Cancel", "Continue"],
      }).then((willContinue) => {
        if (willContinue) {
          proceedToNext();
        }
      });
      return;
    }
    
    proceedToNext();
  };

  const proceedToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(timePerQuestion);
    } else {
      // Last question - submit quiz
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimeRemaining(timePerQuestion);
    }
  };

  const handleSubmit = async () => {
    // Check if past due date
    if (isPastDue) {
      swal("Error", "Cannot submit - this quiz is past the due date.", "error");
      return;
    }

    const unansweredQuestions = questions.filter((q) => !answers[q.id]);

    if (unansweredQuestions.length > 0) {
      const willSubmit = await swal({
        title: "Unanswered Questions",
        text: `You have ${unansweredQuestions.length} unanswered question(s). Submit anyway?`,
        icon: "warning",
        buttons: ["Cancel", "Submit Anyway"],
      });

      if (!willSubmit) return;
    }

    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalScore = (correctCount / questions.length) * 100;
    setScore(totalScore);
    setSubmitted(true);

    try {
      const { data } = await axiosClient.post(`/quiz/${decryptedID}/submit`, {
        classroom_id: decryptedID,
        student_id: user.id,
        quiz_code: quizCode,
        answers: answers,
        score: totalScore,
        created_at: decryptedDate,
      });

      if (data.already_submitted) {
        swal("Info", "You already submitted this quiz!", "info");
      } else {
        swal("Success", `Quiz submitted! Your score: ${totalScore.toFixed(2)}%`, "success");
      }
    } catch (err) {
      console.error(err);
      swal("Error", "Something went wrong submitting your quiz.", "error");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  // Show results view after submission
  if (submitted) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button
              className="btn p-2 me-2"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft style={{ fontSize: "20px" }} />
            </button>
            <h2 className="mb-0">{quizTitle} - Results</h2>
          </div>
        </div>

        <div className="alert alert-success mb-4">
          <h4 className="alert-heading">Quiz Completed!</h4>
          <p className="mb-0">
            Your Score: <strong>{score.toFixed(2)}%</strong> (
            {Math.round((score / 100) * questions.length)}/{questions.length} correct)
          </p>
        </div>

        {/* All Questions Review */}
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

              <p className="fs-5 mb-4">{q.questionText}</p>

              <div className="mt-3">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === opt;
                  const isCorrect = q.correctAnswer === opt;

                  return (
                    <div
                      key={optIdx}
                      className={`d-flex align-items-center mb-2 p-3 rounded border ${
                        isCorrect
                          ? "border-success bg-success bg-opacity-10"
                          : isSelected
                          ? "border-danger bg-danger bg-opacity-10"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        className="form-check-input me-3"
                        checked={isSelected}
                        disabled
                      />
                      <span className="badge bg-secondary me-3">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-grow-1">{opt}</span>
                      {isCorrect && (
                        <span className="badge bg-success ms-2">Correct</span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="badge bg-danger ms-2">Wrong</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        <div className="text-end">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i> Back to Classroom
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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
          <h2 className="mb-0">{quizTitle}</h2>
        </div>
      </div>

      {/* Due Date Information */}
      {dueDate && (
        <div className={`alert ${isPastDue ? 'alert-danger' : 'alert-info'} mb-4`}>
          <div className="d-flex align-items-center">
            <i className={`bi ${isPastDue ? 'bi-exclamation-triangle-fill' : 'bi-calendar-event'} me-2`}></i>
            <div>
              <strong>{isPastDue ? 'Past Due:' : 'Due Date:'}</strong>{' '}
              {dueDate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      )}

      {/* Past Due Warning */}
      {isPastDue && (
        <div className="alert alert-warning mb-4">
          <h5 className="alert-heading">
            <i className="bi bi-lock-fill me-2"></i>
            Quiz Closed
          </h5>
          <p className="mb-0">
            The due date for this quiz has passed. You cannot submit answers.
          </p>
        </div>
      )}

      {!isPastDue && (
        <>
          {/* Progress and Timer Bar */}
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-1">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h5>
                  <div className="progress" style={{ width: "200px", height: "8px" }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{
                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-end">
                  <div
                    className={`badge fs-4 ${
                      timeRemaining <= 10 ? "bg-danger" : "bg-primary"
                    }`}
                  >
                    <i className="bi bi-clock me-2"></i>
                    {formatTime(timeRemaining)}
                  </div>
                  {timeRemaining <= 10 && (
                    <div className="text-danger small mt-1">Hurry up!</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Question */}
          {currentQuestion && (
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold">Question {currentQuestionIndex + 1}</h5>
                  <span
                    className={`badge ${
                      currentQuestion.difficultyLevel === "easy"
                        ? "bg-success"
                        : currentQuestion.difficultyLevel === "medium"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    {currentQuestion.difficultyLevel}
                  </span>
                </div>

                <p className="fs-5 mb-4">{currentQuestion.questionText}</p>

                <div className="mt-3">
                  {currentQuestion.options.map((opt, optIdx) => {
                    const isSelected = answers[currentQuestion.id] === opt;

                    return (
                      <div
                        key={optIdx}
                        className={`d-flex align-items-center mb-3 p-3 rounded border ${
                          isSelected
                            ? "border-primary bg-primary bg-opacity-10"
                            : "border-secondary"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleAnswerChange(currentQuestion.id, opt)}
                      >
                        <input
                          type="radio"
                          className="form-check-input me-3"
                          checked={isSelected}
                          onChange={() => handleAnswerChange(currentQuestion.id, opt)}
                        />
                        <span className="badge bg-secondary me-3">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-grow-1 fs-5">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-secondary btn-lg"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <i className="bi bi-arrow-left me-2"></i> Previous
            </button>

            <button
              className={`btn btn-lg ${isLastQuestion ? "btn-success" : "btn-primary"}`}
              onClick={() => handleNextQuestion(false)}
            >
              {isLastQuestion ? (
                <>
                  <i className="bi bi-check-circle me-2"></i> Submit Quiz
                </>
              ) : (
                <>
                  Next <i className="bi bi-arrow-right ms-2"></i>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}