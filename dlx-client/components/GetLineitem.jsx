import React, { useState } from "react";

const GetLineitem = () => {
  const [lineitems, setLineitems] = useState([]);
  const [msg, setMsg] = useState("");

  const getLtik = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const ltik = searchParams.get("ltik");
    return ltik;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/grade/getLineitem", {
      credentials: "include",
      headers: { Authorization: "Bearer " + getLtik() },
    })
      .then((response) => response.json())
      .then((data) => {
        const msg = data.message;
        const lineitems = data.lineItem.lineItems;
        setMsg(msg);
        setLineitems(lineitems);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="m-5">
      <form onSubmit={handleSubmit}>
        <p className="text-2xl font-extrabold my-1">Get Lineitem(s)</p>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-5 mx-2 py-2 px-4 rounded"
        >
          Get Lineitem
        </button>
        {msg && <p className="text-blue-500">{msg}</p>}
        {lineitems.map((item, index) => (
          <div key={index} className="lineitem">
            <div class="line2" />
            <a style={{ fontWeight: "600" }}>Label: </a>
            <a>{item.label}</a>
            <br />
            <a style={{ fontWeight: "600" }}>Id: </a>
            <a>{item.id}</a>
            <br />
          </div>
        ))}
      </form>
    </div>
  );
};

export default GetLineitem;
