import { useEffect, useState } from "react";

const Deeplink = () => {
  const actionUrl = `https://${window.location.hostname}/deeplink`;
  const [contents, setContents] = useState(null);
  const [selectedContents, setSelectedContents] = useState([]);

  useEffect(() => {
    fetchContents();
  }, []);

  // Get Lti key from URL
  const getLtik = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const ltik = searchParams.get("ltik");
    return ltik;
  };

  const fetchContents = async () => {
    try {
      await fetch("/deeplink/contents", {
        credentials: "include",
        headers: { Authorization: "Bearer " + getLtik() },
      })
        .then((res) => res.json())
        .then((contents) => setContents(contents));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSelectedContent = (e) => {
    const checkbox = e.target;
    const selectedContent = JSON.parse(checkbox.value);

    if (checkbox.checked) {
      // If checked, add to the selectedContents array
      setSelectedContents([...selectedContents, selectedContent]);
    } else {
      // Otherwise, exclude it.
      setSelectedContents(
        selectedContents.filter((item) => item._id !== selectedContent._id)
      );
    }
  };

  const handleSubmit = (e) => {
    if (selectedContents.length === 0) {
      alert("Please select 1 or more content!");
      e.preventDefault();
      return;
    }
  };

  return (
    <container>
      <div className="w-fit mx-auto my-10 p-10 border-0 ring-1 ring-inset ring-gray-300 rounded-xl">
        {!contents ? (
          <div className="m-10 text-center">Loading DLX contents...</div>
        ) : (
          <form
            method="POST"
            action={actionUrl}
            onSubmit={handleSubmit}
            className="w-fit m-auto"
          >
            <input type="hidden" name="ltik" value={getLtik()} />
            {contents.map((content, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={`dlx-${index}`}
                  name="dlx"
                  value={JSON.stringify(content)}
                  onChange={handleUpdateSelectedContent}
                  className="mb-5 align-middle"
                />
                <label htmlFor={`dlx-${index}`} className="m-1 text-xl">
                  {content.title}
                </label>
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-5 py-2 px-4 rounded block m-auto text-xl"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </container>
  );
};

export default Deeplink;
