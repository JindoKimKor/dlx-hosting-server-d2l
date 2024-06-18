import React, { useState } from "react";

const CreateLineitem = () => {
  const [label, setLabel] = useState("");
  const [msg, setMsg] = useState("");

  const getLtik = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const ltik = searchParams.get("ltik");
    return ltik;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/grade/createLineitem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: label,
        ltik: getLtik(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const success = data.message;
        setMsg(success);
        setLabel("");
      })
      .catch((error) => setMsg(error));
  };
  const handleChange = (e) => {
    setLabel(e.target.value);
  };

  return (
    <div className="m-5">
      <form onSubmit={handleSubmit}>
        <p className="text-2xl font-extrabold my-1">Create a Lineitem</p>
        <label class="result">
          Lineitem name:
          <input
            type="text"
            name="label"
            style={{ marginLeft: "8px" }}
            value={label}
            onChange={handleChange}
            className="rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300"
          />
        </label>
        <button
          type="submit"
          class="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-5 mx-2 py-2 px-4 rounded"
        >
          Create
        </button>
      </form>
      <p className="text-blue-500">{msg}</p>
      <br />
    </div>
  );
};

export default CreateLineitem;
