import React, { useState, useEffect } from "react";

const NamesAndRoles = () => {
  const [members, setMembers] = useState({});
  const [isFetched, setIsFetched] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("All");

  const roles = ["Learner", "Instructor", "Administrator"];

  // Get Lti key from URL
  const getLtik = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const ltik = searchParams.get("ltik");
    return ltik;
  };

  // Fetch members from backend
  const fetchMembers = async () => {
    try {
      await fetch("/members", {
        credentials: "include",
        headers: { Authorization: "Bearer " + getLtik() },
      })
        .then((res) => res.json())
        .then((members) => {
          setIsFetched(true);
          return setMembers(
            members.filter((member) =>
              role === "All"
                ? member.name.toLowerCase().includes(name.toLowerCase())
                : member.name.toLowerCase().includes(name.toLowerCase()) &&
                  member.roles.includes(role)
            )
          );
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  useEffect(() => {
    fetchMembers();
  }, [name, role]);

  return (
    isFetched && (
      <div className="m-5">
        <p className="text-2xl font-extrabold my-1">Names and Role Service</p>
        {/* Filter by name */}
        <span>
          <label for="names" class="result">
            Name:{" "}
          </label>
          <input
            type="text"
            id="names"
            name="names"
            onChange={handleNameChange}
            className="rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300"
          />
        </span>
        {/* Fiter by role */}
        <div className="m-5 inline-block text-right">
          <label for="roles">Role: </label>
          <select
            id="roles"
            name="roles"
            onChange={handleRoleChange}
            className="rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300"
          >
            <option value="All" selected>
              All
            </option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        {/* Members table */}
        <table className="table-auto border-collapse border border-slate-500">
          <tr>
            <th className="border border-slate-600 p-2">Name</th>
            <th className="border border-slate-600 p-2">Roles</th>
          </tr>
          {members.map((member, index) => (
            <tr key={index}>
              <td className="border border-slate-700 p-2">{member.name}</td>
              <td className="border border-slate-700 p-2">
                {member.roles.map((role) => `${role} `)}
              </td>
            </tr>
          ))}
        </table>
      </div>
    )
  );
};

export default NamesAndRoles;
