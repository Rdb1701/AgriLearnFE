import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from "../../../utils/axios-client";
import { useStateContext } from "../../contexts/ContextProvider";

export default function QuizForm() {
  const [quizTitle, setQuizTitle] = useState('Untitled Quiz');
  const [questions, setQuestions] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const { id, material_id } = useParams();
  const {user} = useStateContext();
  const navigate = useNavigate();

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True or False' }
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'multiple-choice',
      questionsText: 'Enter your question here',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: '',
      difficultyLevel: 'easy'
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const duplicateQuestion = (id) => {
    const questionToDuplicate = questions.find(q => q.id === id);
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: Date.now(),
      questionsText: questionToDuplicate.questionsText + ' (Copy)'
    };
    const questionIndex = questions.findIndex(q => q.id === id);
    const newQuestions = [...questions];
    newQuestions.splice(questionIndex + 1, 0, duplicatedQuestion);
    setQuestions(newQuestions);
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.map((opt, idx) => 
              idx === optionIndex ? value : opt
            )
          }
        : q
    ));
  };

  const moveQuestion = (id, direction) => {
    const currentIndex = questions.findIndex(q => q.id === id);
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === questions.length - 1)) return;
    
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newQuestions[currentIndex], newQuestions[targetIndex]] = 
    [newQuestions[targetIndex], newQuestions[currentIndex]];
    setQuestions(newQuestions);
  };

  const handleTypeChange = (questionId, newType) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        if (newType === 'true-false') {
          return {
            ...q,
            type: newType,
            options: ['True', 'False'],
            correctAnswer: ''
          };
        } else {
          return {
            ...q,
            type: newType,
            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            correctAnswer: ''
          };
        }
      }
      return q;
    }));
  };

  //SAVING QUIZ
  const saveQuiz = async () => {
  try {
    const quizData = {
      quiz_title: quizTitle,
      classroom_id: id,  
      created_by: user.id,     
      questions: questions.map(q => ({
        questions_text: q.questionsText,
        options: q.options,
        correct_answer: q.correctAnswer,
        difficulty_level: q.difficultyLevel
      }))
    };

    const response = await axiosClient.post("/quizzes", quizData);

    swal("", `${response.data.message}`, "success");
    navigate(`/instructor/classrooms/${id}`)
    
  } catch (error) {
    console.error(error.response?.data || error.message);
    alert("Failed to save quiz");
  }
};

  const renderQuestionEditor = (question, index) => {
    return (
      <div key={question.id} className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-8">
              <label className="form-label fw-bold">Question {index + 1}</label>
              <textarea
                className="form-control"
                value={question.questionsText}
                onChange={(e) => updateQuestion(question.id, 'questionsText', e.target.value)}
                placeholder="Enter your question here"
                rows="3"
              />
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Question Type</label>
                <select
                  className="form-select"
                  value={question.type}
                  onChange={(e) => handleTypeChange(question.id, e.target.value)}
                >
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Difficulty Level</label>
                <select
                  className="form-select"
                  value={question.difficultyLevel}
                  onChange={(e) => updateQuestion(question.id, 'difficultyLevel', e.target.value)}
                >
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Options & Correct Answer</label>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="d-flex align-items-center mb-2">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  className="form-check-input me-2"
                  checked={question.correctAnswer === option}
                  onChange={() => updateQuestion(question.id, 'correctAnswer', option)}
                  title="Select as correct answer"
                />
                <span className="badge bg-secondary me-2">{String.fromCharCode(65 + optionIndex)}</span>
                {question.type === 'true-false' ? (
                  <span className="form-control-plaintext">{option}</span>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={option}
                    onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                )}
              </div>
            ))}
            {!question.correctAnswer && (
              <small className="text-danger">Please select the correct answer</small>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center pt-3 border-top">
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => duplicateQuestion(question.id)}
              >
                <i className="bi bi-files"></i> Duplicate
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => deleteQuestion(question.id)}
              >
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
            <div className="d-flex gap-1">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={index === 0}
                onClick={() => moveQuestion(question.id, 'up')}
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={index === questions.length - 1}
                onClick={() => moveQuestion(question.id, 'down')}
                title="Move down"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionPreview = (question, index) => {
    return (
      <div key={question.id} className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 className="card-title mb-0">
              Question {index + 1}
            </h5>
            <span className={`badge ${
              question.difficultyLevel === 'easy' ? 'bg-success' :
              question.difficultyLevel === 'medium' ? 'bg-warning' : 'bg-danger'
            }`}>
              {question.difficultyLevel.charAt(0).toUpperCase() + question.difficultyLevel.slice(1)}
            </span>
          </div>
          
          <p className="card-text mb-4">{question.questionsText}</p>

          <div className="row">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="col-md-6 mb-2">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name={`question-${question.id}`}
                    id={`q${question.id}-opt${optionIndex}`}
                  />
                  <label className="form-check-label" htmlFor={`q${question.id}-opt${optionIndex}`}>
                    <span className="badge bg-light text-dark me-2">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    {option}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Quiz Builder</h2>
            <div className="d-flex gap-2">
              <button
                type="button"
                className={`btn ${previewMode ? 'btn-outline-primary' : 'btn-primary'}`}
                onClick={() => setPreviewMode(!previewMode)}
              >
                <i className="bi bi-eye me-1"></i>
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button 
                type="button" 
                className="btn btn-success"
                onClick={saveQuiz}
                disabled={questions.length === 0 || questions.some(q => !q.correctAnswer)}
              >
                <i className="bi bi-check-circle me-1"></i>
                Save Quiz
              </button>
            </div>
          </div>

          {/* Quiz Title */}
          <div className="card mb-4 shadow-sm border-top border-4 border-success">
            <div className="card-body">
              {previewMode ? (
                <h1 className="display-6 fw-bold text-success">{quizTitle}</h1>
              ) : (
                <>
                  <label className="form-label fw-bold">Quiz Title</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Enter quiz title"
                  />
                </>
              )}
            </div>
          </div>

          {/* Questions */}
          {questions.map((question, index) => (
            previewMode 
              ? renderQuestionPreview(question, index)
              : renderQuestionEditor(question, index)
          ))}

          {/* Add Question Button */}
          {!previewMode && (
            <div className="text-center">
              <button
                type="button"
                className="btn btn-outline-success btn-lg"
                onClick={addQuestion}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Question
              </button>
            </div>
          )}

          {/* Preview Submit Button */}
          {previewMode && questions.length > 0 && (
            <div className="text-center mt-4">
              <button type="button" className="btn btn-success btn-lg">
                <i className="bi bi-play-circle me-2"></i>
                Start Quiz
              </button>
            </div>
          )}

          {/* Empty State */}
          {questions.length === 0 && (
            <div className="text-center py-5">
              <div className="text-muted">
                <i className={`bi ${previewMode ? 'bi-question-circle' : 'bi-plus-circle'} display-1`}></i>
                <h4 className="mt-3">
                  {previewMode ? 'No questions yet' : 'Start building your quiz'}
                </h4>
                <p>
                  {previewMode 
                    ? 'Switch to edit mode to add your first question.' 
                    : 'Add your first question to get started.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Quiz Summary */}
          {questions.length > 0 && (
            <div className="card mt-4 bg-light">
              <div className="card-body">
                <h6 className="card-title">Quiz Summary</h6>
                <div className="row text-center">
                  <div className="col-md-3">
                    <strong>{questions.length}</strong>
                    <div className="text-muted small">Total Questions</div>
                  </div>
                  <div className="col-md-3">
                    <strong>{questions.filter(q => q.type === 'multiple-choice').length}</strong>
                    <div className="text-muted small">Multiple Choice</div>
                  </div>
                  <div className="col-md-3">
                    <strong>{questions.filter(q => q.type === 'true-false').length}</strong>
                    <div className="text-muted small">True/False</div>
                  </div>
                  <div className="col-md-3">
                    <strong>{questions.filter(q => q.correctAnswer).length}/{questions.length}</strong>
                    <div className="text-muted small">Answers Set</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}