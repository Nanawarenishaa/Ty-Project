import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};
