import React from "react";
import "../index.css"; // or wherever your global styles are
import buttonImage from "../assets/button.png";

const CustomButton = ({ text, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundImage: `url(${buttonImage})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "200px",
        height: "70px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        fontFamily: "DidotBoldItalic",
        color: "#454525",
        fontSize: "1rem",
        textAlign: "center",
        userSelect: "none",
      }}
    >
      {text}
    </div>
  );
};

export default CustomButton;