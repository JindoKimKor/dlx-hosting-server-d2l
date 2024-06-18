import React, { useState } from "react";

const DeleteLineitem = () => {
  const [successMsg, setSuccessMsg] = useState([]);
  const [failMsg, setFailMsg] = useState([]);
  const [msg, setMsg] = useState("");

  const getLtik = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const ltik = searchParams.get("ltik");
    return ltik;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/grade/deletelineitem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ltik: getLtik() }),
    })
      .then((response) => response.json())
      .then((response) => {
        setSuccessMsg(response.success);
        setFailMsg(response.failure);
        setMsg(response.message);
      })
      .catch((error) => setFailMsg([error]));
  };

  return (
    <div className="m-5">
      <form onSubmit={handleSubmit}>
        <p className="text-2xl font-extrabold my-1">Delete Lineitem(s)</p>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-5 mx-2 py-2 px-4 rounded"
        >
          Delete
        </button>
      </form>
      {successMsg.length > 0 && (
        <div>
          <p className="text-blue-500">{msg}</p>
          {successMsg.map((msg) => (
            <div>{msg.lineitem}</div>
          ))}
        </div>
      )}
      {failMsg.length > 0 && (
        <div>
          <p>{msg}</p>
          <div />
          {failMsg.map((msg) => (
            <div>{msg.lineitem}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeleteLineitem;
