import { authService } from "myBase";
import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const Navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    Navigate("/", { replace: true });
  };

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
