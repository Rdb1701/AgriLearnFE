export default function StreamContent() {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body text-center py-5">
        <div className="mb-4">
          <i
            className="fas fa-comments"
            style={{ fontSize: "4rem", color: "#28a745", opacity: 0.3 }}
          ></i>
        </div>
        <h5 className="mb-3">This is where you can talk to your class</h5>
        <p className="text-muted mb-4">
          Use the stream to share announcements, post assignments, and respond
          to student questions
        </p>
      </div>
    </div>
  );
}
