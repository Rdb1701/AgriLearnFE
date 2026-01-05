import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axios-client";
import { IoGameController } from "react-icons/io5";
import { LuSmartphone } from "react-icons/lu";

export default function GameSimulation() {
  const { id } = useParams();
  const { token } = useStateContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulationOn, setIsSimulationOn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkSimulationStatus = async () => {
      try {
        const response = await axiosClient.get(
          `/classroom/${id}/is-simulation-on`
        );
        if (response.data.is_simulation_on) {
          setIsSimulationOn(true);
        } else {
          // Simulation is off, redirect back
          navigate(-1);
        }
      } catch (error) {
        console.error("Error checking simulation status:", error);
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    checkSimulationStatus();
  }, [id, navigate]);

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

  useEffect(() => {
    const checkDevice = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
    };

    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkDevice();
    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  useEffect(() => {
    const enableFullscreen = () => {
      const iframe = iframeRef.current;
      if (iframe?.requestFullscreen) iframe.requestFullscreen();
      else if (iframe?.webkitRequestFullscreen)
        iframe.webkitRequestFullscreen();

      document.removeEventListener("click", enableFullscreen);
      document.removeEventListener("touchstart", enableFullscreen);
    };

    document.addEventListener("click", enableFullscreen);
    document.addEventListener("touchstart", enableFullscreen);

    return () => {
      document.removeEventListener("click", enableFullscreen);
      document.removeEventListener("touchstart", enableFullscreen);
    };
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a2e",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <h4 style={{ marginBottom: "8px" }}>Loading Simulation</h4>
            <p style={{ color: "#aaa", margin: 0 }}>
              Checking simulation status...
            </p>
          </div>
        </div>
        <style>
          {`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.7; }
            }
          `}
        </style>
      </div>
    );
  }

  if (!isSimulationOn) {
    return null;
  }

  if (isMobile && isPortrait) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a2e",
          color: "white",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            maxWidth: "300px",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "rgba(25, 135, 84, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "rotatePhone 2s ease-in-out infinite",
            }}
          >
            <LuSmartphone size={50} color="#198754" />
          </div>
          <div>
            <h4 style={{ marginBottom: "12px", fontWeight: "600" }}>
              Rotate Your Device
            </h4>
            <p style={{ color: "#aaa", margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
              Please rotate your phone to <strong style={{ color: "#198754" }}>landscape mode</strong> to play the simulation game.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 20px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#ccc",
            }}
          >
            <span style={{ transform: "rotate(90deg)" }}>
              <LuSmartphone size={24} color="#198754" />
            </span>
            <span>→</span>
            <span>
              <LuSmartphone size={24} color="#6c757d" />
            </span>
          </div>
        </div>
        <style>
          {`
            @keyframes rotatePhone {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(-15deg); }
              75% { transform: rotate(15deg); }
            }
          `}
        </style>
      </div>
    );
  }

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
        src={`/godot/AgriLearn.html?room=${id}&token=${token}&api_url=${
          import.meta.env.VITE_API_BASE_URL
        }`}
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
