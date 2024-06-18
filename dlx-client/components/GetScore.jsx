import React, { useState } from "react";

const GetScore = () => {
  const [score, setScore] = useState("");

  const getLtik = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const ltik = searchParams.get("ltik");
    return ltik;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/grade/getscore", {
      credentials: "include",
      headers: { Authorization: "Bearer " + getLtik() },
    })
      .then((res) => res.json())
      .then((data) => {
        const resultScore = data.scores[0].resultScore;
        setScore(resultScore);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="m-5">
      <form onSubmit={handleSubmit}>
        <p className="text-2xl font-extrabold my-1">Get Grade</p>
        <p>get lineitem(external tool)'s grade</p>
        <label>
          Grade:
          <a style={{ marginLeft: "20px" }}>{score}</a>
        </label>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-5 mx-2 py-2 px-4 rounded"
        >
          Get Grade
        </button>
      </form>
    </div>
  );
};

export default GetScore;
