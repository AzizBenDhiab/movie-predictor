import React, { useState, useEffect } from "react";
import "./App.css";
import FilmPredictionForm from "./components/filmPredictionForm";

function App() {
  const [showForm, setShowForm] = useState(false);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 100) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  };

  const backToHome = () => {
    setShowForm(false);
  };

  useEffect(() => {
    if (showForm) {
      document.body.classList.add("form-active");
    } else {
      document.body.classList.remove("form-active");
    }
  }, [showForm]);

  return (
    <div
      className={`App ${showForm ? "form-active" : ""}`}
      onScroll={handleScroll}
    >
      {/* Header (Hidden when form is active) */}
      <div className="header">
        <h1>Predict Your Movie Success</h1>
        <h2>Direct Your Masterpiece</h2>
      </div>

      {/* Content for scrolling */}
      <div className="content">
        <div style={{ height: "1000px" }}></div>
      </div>

      {/* Form overlay appearing as a second page */}
      <div className={`form-overlay ${showForm ? "show" : ""}`}>
        <FilmPredictionForm backToHome={backToHome} />
      </div>
    </div>
  );
}

export default App;
