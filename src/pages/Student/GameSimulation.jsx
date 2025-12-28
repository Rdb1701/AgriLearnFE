import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useEffect } from "react";

export default function GameSimulation() {
  const { id } = useParams();
  const { token } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    window.closeGameFromGodot = () => {
      console.log("closeGameFromGodot CALLED!");
      navigate(-1);
    };

    console.log("closeGameFromGodot set:", typeof window.closeGameFromGodot);

    return () => {
      delete window.closeGameFromGodot;
    };
  }, [navigate]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <iframe
        src={`/godot/AgriLearn.html?room=${id}&token=${token}`}
        title="Game Simulation"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
          overflow: "hidden",
        }}
        allow="fullscreen"
        allowFullScreen
      />
    </div>
  );
}
