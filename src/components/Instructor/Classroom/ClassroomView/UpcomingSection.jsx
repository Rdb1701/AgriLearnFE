import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { encrypt } from "../../../../../utils/encryption";
import axiosClient from "../../../../../utils/axios-client";
import { useStateContext } from "../../../../contexts/ContextProvider";

export default function UpcomingSection() {
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // classroom_id
  const navigate = useNavigate();
  const { user } = useStateContext();


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axiosClient.get(`/quiz/${id}/quizzes`);
        const quizzes = response.data;

        // Get current date and time
        const now = new Date();

        // Filter upcoming quizzes (due date is in the future)
        const upcoming = quizzes
          .filter((quiz) => quiz.due_date && new Date(quiz.due_date) > now)
          .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

        setUpcomingQuizzes(upcoming);
      } catch (error) {
        console.error("Failed to load upcoming quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [id]);



  //handle quiz
  const handleClickQuizView = (id, created_at, quiz_code) => {
    if (!id || !created_at) {
      console.error("Missing id or created_at", { id, created_at });
      return;
    }

    const encryptedID = encodeURIComponent(encrypt(id));

    const encryptedDate = encodeURIComponent(encrypt(created_at));

    //if instructor role
    if (user.role === "Instructor") {
      navigate(`/instructor/classwork/${encryptedID}/quizView/${encryptedDate}`);

    }

    const encryptedCode = encodeURIComponent(encrypt(quiz_code));
    //if student role
    if (user.role === "Student") {
      navigate(`/student/quiz/${encryptedID}/quizView/${encryptedDate}/${encryptedCode}`);
    }
  };


  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h6 className="mb-3">Upcoming Quizzes</h6>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : upcomingQuizzes.length === 0 ? (
          <p className="text-muted mb-3">No upcoming quizzes</p>
        ) : (
          <ul className="list-group list-group-flush mb-3">
            {upcomingQuizzes.slice(0, 5).map((quiz, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center border-0 px-0"
              >
                <div>
                  <h6 className="mb-1 fw-semibold text-dark">
                    {quiz.quiz_title}
                  </h6>
                  <small className="text-muted">
                    Due: {new Date(quiz.due_date).toLocaleDateString()}
                  </small>
                </div>
                <Link
                  onClick={() => handleClickQuizView(quiz.classroom_id, quiz.created_at, quiz.quiz_code)}
                  className="btn btn-sm btn-outline-success"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* <Link to={`/instructor/classrooms/${id}/quizzes`} className="text-success text-decoration-none fw-semibold">
          View all
        </Link> */}
      </div>
    </div>
  );
}