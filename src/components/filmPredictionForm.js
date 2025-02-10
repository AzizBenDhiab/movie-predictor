import { useState, useEffect } from "react";
import "./filmPredictionForm.css";

export default function FilmPredictionForm({ backToHome }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: [],
    company: "",
    language: "",
    genres: [],
    belongsToCollection: false, // New boolean field
  });

  const [languages, setLanguages] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  const genres = [
    "Drama",
    "Comedy",
    "Thriller",
    "Romance",
    "Action",
    "Horror",
    "Crime",
    "Documentary",
    "Adventure",
    "Science Fiction",
    "Family",
    "Mystery",
    "Fantasy",
    "Animation",
    "Music",
    "History",
    "War",
    "Western",
  ];

  useEffect(() => {
    const fetchLanguages = async () => {
      const url =
        "https://list-of-all-countries-and-languages-with-their-codes.p.rapidapi.com/languages";
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "fef12f5ef6msh1e28aa052f936d6p178eeajsn3be686c1db87",
          "x-rapidapi-host":
            "list-of-all-countries-and-languages-with-their-codes.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setLanguages(result);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;
    if (type === "select-multiple") {
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData({ ...formData, [name]: selectedOptions });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleKeywordChange = (e) => {
    setNewKeyword(e.target.value);
  };

  const addKeyword = () => {
    if (newKeyword.trim() !== "") {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, newKeyword.trim()],
      });
      setNewKeyword("");
    }
  };

  const removeKeyword = (index) => {
    const updatedKeywords = formData.keywords.filter((_, i) => i !== index);
    setFormData({ ...formData, keywords: updatedKeywords });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const genreFlags = genres.reduce((acc, genre) => {
      acc[`is${genre.replace(/\s+/g, "")}`] = formData.genres.includes(genre)
        ? 1
        : 0;
      return acc;
    }, {});

    const dataToSubmit = {
      ...formData,
      company: [formData.company], // Ensure company is in a list
      ...genreFlags,
      belongsToCollection: formData.belongsToCollection ? 1 : 0,
    };

    delete dataToSubmit.genres;

    console.log("Sending request:", JSON.stringify(dataToSubmit));

    try {
      const response = await fetch("http://127.0.0.1:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      setPrediction(result);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="film-form">
      <div className="top-right-container">
        <button className="scroll-to-top" onClick={backToHome}>
          ✖
        </button>
      </div>
      <h2>Movie Rating Predictor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          placeholder="Enter title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
        />
        <label>Description:</label>
        <textarea
          name="description"
          placeholder="Enter description"
          value={formData.description}
          onChange={handleChange}
          className="form-input"
        />
        <label>Production Company:</label>
        <input
          type="text"
          name="company"
          placeholder="Enter company"
          value={formData.company}
          onChange={handleChange}
          className="form-input"
        />
        <label>Select Language:</label>
        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">Select a language</option>
          {languages.map((lang) => (
            <option key={lang} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <label className="checkbox-container">
          Belongs to a Collection:
          <input
            type="checkbox"
            name="belongsToCollection"
            checked={formData.belongsToCollection}
            onChange={handleChange}
          />
        </label>

        <div className="keywords-section">
          <label>Keywords:</label>

          <input
            type="text"
            placeholder="Enter keyword"
            value={newKeyword}
            onChange={handleKeywordChange}
            className="form-input"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="add-keyword-button"
          >
            Add Keyword
          </button>
          <div className="keywords-list">
            {formData.keywords.map((keyword, index) => (
              <div key={index} className="keyword-item">
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(index)}
                  className="remove-keyword-button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <label>Select Genres:</label>

        <div className="genres-section">
          <div className="genres-list">
            {genres.map((genre) => (
              <label key={genre} className="genre-item">
                <input
                  type="checkbox"
                  value={genre}
                  checked={formData.genres.includes(genre)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        genres: [...formData.genres, genre],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        genres: formData.genres.filter((g) => g !== genre),
                      });
                    }
                  }}
                />
                {genre}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? "Predicting..." : "Get Prediction"}
        </button>
      </form>

      {prediction !== null && (
        <div className="prediction-result">
          🎬 Predicted Rating:{" "}
          <span className="font-bold text-xl">{prediction.toFixed(2)}</span>/10
        </div>
      )}
    </div>
  );
}
