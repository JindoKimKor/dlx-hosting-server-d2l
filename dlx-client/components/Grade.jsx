import React, { useState } from "react";

const Grade = () => {
  const actionUrl = `https://${window.location.hostname}/grade`;
  const [grade, setGrade] = useState(0);
  const [msg, setMsg] = useState("");

  const getLtik = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const ltik = searchParams.get("ltik");
    return ltik;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/grade", {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: "Bearer " + getLtik(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grade: grade,
        ltik: getLtik(),
      }),
    })
      .then((response) => response.json())
      .then((response) => setMsg(response.message))
      .catch((error) => console.error("Error:", error));
  };

  const handleChange = (e) => {
    setGrade(e.target.value);
  };

  return (
    <div className="m-5">
      <p className="text-2xl font-extrabold my-1">
        Grades and Assignment Service
      </p>
      <form onSubmit={handleSubmit}>
        <p className="font-extrabold my-1">Submit Score</p>
        <p>get current lineitem(external tool)id and submit score</p>
        <label for="grade">Grade:</label>
        <input
          type="number"
          id="grade"
          name="grade"
          value={grade}
          onChange={handleChange}
          className="rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-5 mx-2 py-2 px-4 rounded"
        >
          Submit Grade
        </button>
      </form>
      {msg && <p className="text-blue-500">{msg}</p>}
    </div>
  );
};

export default Grade;
