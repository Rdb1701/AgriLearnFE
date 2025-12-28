import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import axiosClient from "../../../utils/axios-client";

export default function Dashboard() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [performanceData, setPerformanceData] = useState({ labels: [], datasets: [] });
  const [trendsData, setTrendsData] = useState({ labels: [], datasets: [] });
  const [difficultyData, setDifficultyData] = useState({ labels: [], datasets: [] });
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [stats, setStats] = useState({ 
    totalQuizzes: 0, 
    totalSubmissions: 0, 
    avgScore: 0,
    totalDifficulties: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (classrooms.length > 0) {
      fetchDashboardData();
    }
  }, [selectedClassroom]);

  const fetchClassrooms = async () => {
    try {
      const response = await axiosClient.get('/classrooms');
      setClassrooms(response.data.data || []);
    } catch (err) {
      console.error("Error fetching classrooms:", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = selectedClassroom ? { classroom_id: selectedClassroom } : {};

      // Fetch all data in parallel
      const [quizChartRes, performanceRes, trendsRes, difficultyRes] = await Promise.all([
        axiosClient.get('/quiz-chart', { params }),
        axiosClient.get('/student-performance', { params }),
        axiosClient.get('/completion-trends', { params }),
        axiosClient.get('/difficulty-analysis', { params })
      ]);

      // Process quiz performance data
      const quizzes = quizChartRes.data.data;
      
      if (quizzes && quizzes.length > 0) {
        const totalSubmissions = quizzes.reduce((sum, q) => sum + (q.participants || 0), 0);
        const avgScore = quizzes.reduce((sum, q) => sum + (q.average || 0), 0) / quizzes.length;
        
        setStats({
          totalQuizzes: quizzes.length,
          totalSubmissions: totalSubmissions,
          avgScore: avgScore.toFixed(1),
          totalDifficulties: difficultyRes.data.data?.length || 0
        });

        setChartData({
          labels: quizzes.map((q) => {
            // Truncate long quiz titles for better display
            const title = q.quiz_title || 'Untitled Quiz';
            return title.length > 30 ? title.substring(0, 30) + '...' : title;
          }),
          datasets: [
            {
              label: "Average Score (%)",
              data: quizzes.map((q) => q.average),
              backgroundColor: "rgba(75, 192, 192, 0.7)",
              borderRadius: 8,
            },
            {
              label: "Highest Score (%)",
              data: quizzes.map((q) => q.highest),
              backgroundColor: "rgba(54, 162, 235, 0.7)",
              borderRadius: 8,
            },
            {
              label: "Lowest Score (%)",
              data: quizzes.map((q) => q.lowest),
              backgroundColor: "rgba(255, 99, 132, 0.7)",
              borderRadius: 8,
            },
          ],
        });
      } else {
        setStats({
          totalQuizzes: 0,
          totalSubmissions: 0,
          avgScore: 0,
          totalDifficulties: 0
        });
        setChartData({ labels: [], datasets: [] });
      }

      // Process student performance distribution
      const perfData = performanceRes.data.data;
      if (perfData) {
        setPerformanceData({
          labels: Object.keys(perfData),
          datasets: [
            {
              label: "Number of Quiz Attempts",
              data: Object.values(perfData),
              backgroundColor: [
                "rgba(75, 192, 192, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(255, 159, 64, 0.8)",
                "rgba(255, 99, 132, 0.8)",
              ],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        });
      } else {
        setPerformanceData({ labels: [], datasets: [] });
      }

      // Process completion trends
      const trends = trendsRes.data.data;
      if (trends && trends.length > 0) {
        setTrendsData({
          labels: trends.map((t) => {
            const date = new Date(t.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }),
          datasets: [
            {
              label: "Quiz Submissions",
              data: trends.map((t) => t.submissions),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
            },
          ],
        });
      } else {
        setTrendsData({ labels: [], datasets: [] });
      }

      // Process difficulty analysis data
      const difficultyAnalysis = difficultyRes.data.data;
      if (difficultyAnalysis && difficultyAnalysis.length > 0) {
        setDifficultyData({
          labels: difficultyAnalysis.map((d) => d.level),
          datasets: [
            {
              label: "Average Score (%)",
              data: difficultyAnalysis.map((d) => d.average_score),
              backgroundColor: [
                "rgba(75, 192, 192, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(255, 159, 64, 0.8)",
                "rgba(153, 102, 255, 0.8)",
                "rgba(255, 99, 132, 0.8)",
              ],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        });
      } else {
        setDifficultyData({ labels: [], datasets: [] });
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
      setLoading(false);
    }
  };

  const handleClassroomChange = (event) => {
    setSelectedClassroom(event.target.value);
  };

  const clearFilter = () => {
    setSelectedClassroom("");
  };

  if (loading && classrooms.length === 0) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchDashboardData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Filter Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="fw-bold mb-0">Dashboard</h5>
                  <small className="text-muted">
                    {selectedClassroom 
                      ? `Viewing data for selected classroom` 
                      : `Viewing data for all classrooms`
                    }
                  </small>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2 justify-content-end">
                    <select 
                      className="form-select"
                      value={selectedClassroom}
                      onChange={handleClassroomChange}
                      style={{ maxWidth: '300px' }}
                    >
                      <option value="">All Classrooms</option>
                      {classrooms.map((classroom) => (
                        <option key={classroom.id} value={classroom.id}>
                          {classroom.class_name} - {classroom.subject} ({classroom.section_code})
                        </option>
                      ))}
                    </select>
                    {selectedClassroom && (
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={clearFilter}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm" style={{ borderLeft: '4px solid #4bc0c0' }}>
            <div className="card-body">
              <h6 className="text-muted mb-1">Total Quizzes</h6>
              <h2 className="mb-0 fw-bold">{stats.totalQuizzes}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm" style={{ borderLeft: '4px solid #36a2eb' }}>
            <div className="card-body">
              <h6 className="text-muted mb-1">Total Submissions</h6>
              <h2 className="mb-0 fw-bold">{stats.totalSubmissions}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm" style={{ borderLeft: '4px solid #ff6384' }}>
            <div className="card-body">
              <h6 className="text-muted mb-1">Average Score</h6>
              <h2 className="mb-0 fw-bold">{stats.avgScore}%</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm" style={{ borderLeft: '4px solid #ffcd56' }}>
            <div className="card-body">
              <h6 className="text-muted mb-1">Difficulty Levels</h6>
              <h2 className="mb-0 fw-bold">{stats.totalDifficulties}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* First Row Charts */}
      <div className="row">
        {/* Quiz Performance Bar Chart */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Overall Quiz Performance</h5>
            {chartData.labels.length > 0 ? (
              <div style={{ height: '400px' }}>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { 
                        position: "bottom",
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                        }
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: "Score (%)" },
                      },
                      x: {
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45
                        }
                      }
                    },
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">No quiz data available for the selected filter</p>
              </div>
            )}
          </div>
        </div>

        {/* Student Performance Distribution - Doughnut Chart */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Score Distribution</h5>
            {performanceData.labels.length > 0 ? (
              <div style={{ height: '400px' }}>
                <Doughnut
                  data={performanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { 
                          padding: 15, 
                          font: { size: 11 },
                          usePointStyle: true,
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">No performance data available for the selected filter</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="row">
        {/* Completion Trends Line Chart */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Quiz Completion Trends</h5>
            {trendsData.labels.length > 0 ? (
              <div style={{ height: '400px' }}>
                <Line
                  data={trendsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { 
                        position: "bottom",
                        labels: {
                          usePointStyle: true,
                        }
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: "Number of Submissions" },
                        ticks: { stepSize: 5 }
                      },
                      x: {
                        title: { display: true, text: "Date" }
                      }
                    },
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">No trends data available for the selected filter</p>
              </div>
            )}
          </div>
        </div>

        {/* Difficulty Analysis Pie Chart */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Performance by Difficulty Level</h5>
            {difficultyData.labels.length > 0 ? (
              <div style={{ height: '400px' }}>
                <Pie
                  data={difficultyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { 
                          padding: 15, 
                          font: { size: 11 },
                          usePointStyle: true,
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${context.raw}% average score`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">No difficulty data available for the selected filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}