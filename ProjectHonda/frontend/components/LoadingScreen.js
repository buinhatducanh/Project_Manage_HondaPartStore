import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const LoadingScreen = ({ loading }) => {
  if (!loading) return null; // Nếu không loading, không hiển thị gì cả

  return (
    <div style={styles.loadingScreen}>
      <ClipLoader size={50} color="#ffffff" />
      <p style={styles.loadingText}>Đang xử lý...</p>
    </div>
  );
};

// Style cho màn hình loading
const styles = {
  loadingScreen: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Làm mờ nền
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Hiển thị trên tất cả UI khác
    color: "#ffffff",
  },
  loadingText: {
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default LoadingScreen;
