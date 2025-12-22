import React, { useEffect, useState } from "react";
import "./Notes.css";

const getCodeforcesUrl = (id) => {
  if (!id) return "#";
  const parts = id.split("-");
  if (parts.length < 2) return "https://codeforces.com/problemset";
  const contestId = parts[0];
  const index = parts.slice(1).join("-");
  return `https://codeforces.com/problemset/problem/${contestId}/${index}`;
};

export default function Notes() {
    const [solvedInput, setSolvedInput] = useState("");
    const [skippedInput, setSkippedInput] = useState("");

    const [solvedProblems, setSolvedProblems] = useState(() => {
        const saved = localStorage.getItem("solvedProblems");
        return saved ? JSON.parse(saved) : [];
    });

    const [skippedProblems, setSkippedProblems] = useState(() => {
        const saved = localStorage.getItem("skippedProblems");
        return saved ? JSON.parse(saved) : [];
    });

    const [openSolvedNotes, setOpenSolvedNotes] = useState({});
    const [openSkippedNotes, setOpenSkippedNotes] = useState({});

    // Save when updated
    useEffect(() => {
        localStorage.setItem("solvedProblems", JSON.stringify(solvedProblems));
    }, [solvedProblems]);

    useEffect(() => {
        localStorage.setItem("skippedProblems", JSON.stringify(skippedProblems));
    }, [skippedProblems]);

    const handleAddSolved = () => {
        if (!solvedInput.trim()) return;

        const newEntry = {
        id: solvedInput.trim(),
        note: "",
        };

        setSolvedProblems((prev) => [...prev, newEntry]);
        setSolvedInput("");
    };

    const handleAddSkipped = () => {
        if (!skippedInput.trim()) return;

        const newEntry = {
        id: skippedInput.trim(),
        note: "",
        };

        setSkippedProblems((prev) => [...prev, newEntry]);
        setSkippedInput("");
    };

    const updateNote = (index, newNote, type) => {
        if (type === "solved") {
        const updated = [...solvedProblems];
        updated[index].note = newNote;
        setSolvedProblems(updated);
        } else {
        const updated = [...skippedProblems];
        updated[index].note = newNote;
        setSkippedProblems(updated);
        }
    };

    const deleteProblem = (index, type) => {
        if (type === "solved") {
        const id = solvedProblems[index]?.id;
        setSolvedProblems((prev) => prev.filter((_, i) => i !== index));
        if (id) {
            setOpenSolvedNotes((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
            });
        }
        } else {
        const id = skippedProblems[index]?.id;
        setSkippedProblems((prev) => prev.filter((_, i) => i !== index));
        if (id) {
            setOpenSkippedNotes((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
            });
        }
        }
    };

    const toggleNoteVisibility = (id, type) => {
        if (type === "solved") {
        setOpenSolvedNotes((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
        } else {
        setOpenSkippedNotes((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
        }
    };

  return (
    <div className="notes-page">
      <header className="notes-header">
        <h1 className="notes-title">Problem Notes</h1>
        <p className="notes-subtitle">
          Track your solved and skipped Codeforces problems with notes.
        </p>
      </header>

      <section className="notes-section">
        <div className="notes-section-header">
          <h2 className="notes-section-title">Problems Solved</h2>
        </div>

        <div className="notes-input-row">
          <input
            type="text"
            value={solvedInput}
            onChange={(e) => setSolvedInput(e.target.value)}
            placeholder="Enter problem ID (e.g. 1791-A)"
            className="notes-input"
          />
          <button onClick={handleAddSolved} className="notes-add-btn">
            Add
          </button>
        </div>

        <ul className="notes-list">
          {solvedProblems.map((p, idx) => (
            <li key={idx} className="notes-item">
              <div className="notes-item-main">
                <a
                  className="notes-problem-id notes-problem-link"
                  href={getCodeforcesUrl(p.id)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Problem: {p.id}
                </a>
                <div className="notes-actions">
                  <button
                    type="button"
                    className="icon-btn notes-icon"
                    onClick={() => toggleNoteVisibility(p.id, "solved")}
                    title="Show note"
                  >
                    📝
                  </button>
                  <button
                    type="button"
                    className="icon-btn delete-icon"
                    onClick={() => deleteProblem(idx, "solved")}
                    title="Delete problem"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {openSolvedNotes[p.id] && (
                <textarea
                  className="notes-textarea"
                  placeholder="Add note for this problem..."
                  value={p.note}
                  onChange={(e) =>
                    updateNote(idx, e.target.value, "solved")
                  }
                />
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="notes-section">
        <div className="notes-section-header">
          <h2 className="notes-section-title">Problems Skipped</h2>
        </div>

        <div className="notes-input-row">
          <input
            type="text"
            value={skippedInput}
            onChange={(e) => setSkippedInput(e.target.value)}
            placeholder="Enter problem ID (e.g. 1791-A)"
            className="notes-input"
          />
          <button onClick={handleAddSkipped} className="notes-add-btn">
            Add
          </button>
        </div>

        <ul className="notes-list">
          {skippedProblems.map((p, idx) => (
            <li key={idx} className="notes-item">
              <div className="notes-item-main">
                <a
                  className="notes-problem-id notes-problem-link"
                  href={getCodeforcesUrl(p.id)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Problem: {p.id}
                </a>
                <div className="notes-actions">
                  <button
                    type="button"
                    className="icon-btn notes-icon"
                    onClick={() => toggleNoteVisibility(p.id, "skipped")}
                    title="Show note"
                  >
                    📝
                  </button>
                  <button
                    type="button"
                    className="icon-btn delete-icon"
                    onClick={() => deleteProblem(idx, "skipped")}
                    title="Delete problem"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {openSkippedNotes[p.id] && (
                <textarea
                  className="notes-textarea"
                  placeholder="Add note for this problem..."
                  value={p.note}
                  onChange={(e) =>
                    updateNote(idx, e.target.value, "skipped")
                  }
                />
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
