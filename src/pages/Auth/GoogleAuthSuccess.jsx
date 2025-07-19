import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../../utils/axios-client";

export default function GoogleAuthSuccess() {
  const { setUser, setToken } = useStateContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("tokenID");
  const name = searchParams.get("name");
  const email = searchParams.get("email");

  console.log(token);

  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      setToken(token);
      setUser({
        name: name,
        email: email,
      });
      console.log("Token:", token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [searchParams, setToken, navigate]);

  return <div className="text-center mt-5">Authenticating with Google...</div>;
}
