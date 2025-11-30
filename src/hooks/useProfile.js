import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

export const useProfile = () => {
  const context = useContext(ProfileContext);
  
  if (!context) {
    throw new Error("useProfile debe ser usado dentro de ProfileProvider");
  }
  
  return context;
};
