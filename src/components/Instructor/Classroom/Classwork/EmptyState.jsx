import ComputerIllustration from "./ComputerIllustration";

export default function EmptyState() {
  return (
    <div className="text-center py-5">
      <ComputerIllustration />
      <div className="mt-4">
        <h5 className="fw-semibold text-dark mb-3">
          This is where you'll assign work
        </h5>
        <p
          className="text-muted mb-0"
          style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
        >
          You can add assignments and other work for the
          <br />
          class, then organize it into topics
        </p>
      </div>
    </div>
  );
}
