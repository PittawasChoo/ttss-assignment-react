import { useState } from "react";
import { useTodos } from "../../../context/TodoContext";

const Home = () => {
  const {
    todos,
    loading,
    error,
    mutating,
    refresh,
    addTodo,
    editTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  const [title, setTitle] = useState("");

  if (loading) {
    return <div style={{ padding: 16 }}>Loading todos...</div>;
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16 }}>
      <h1>Todo List</h1>

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <b>Error:</b> {error}{" "}
          <button onClick={refresh} style={{ marginLeft: 8 }}>
            Retry
          </button>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = title.trim();
          if (!t) return;
          addTodo(t);
          setTitle("");
        }}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo..."
          style={{ flex: 1, padding: 8 }}
          disabled={mutating}
        />
        <button type="submit" disabled={mutating}>
          {mutating ? "Working..." : "Add"}
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {todos.map((t) => (
          <TodoRow
            key={t.id}
            id={t.id}
            title={t.title}
            done={t.done}
            mutating={mutating}
            onToggle={() => toggleTodo(t.id)}
            onDelete={() => deleteTodo(t.id)}
            onEdit={(newTitle) => editTodo(t.id, newTitle)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Home;

function TodoRow(props: {
  id: string;
  title: string;
  done: boolean;
  mutating: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(props.title);

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 10,
      }}
    >
      <input
        type="checkbox"
        checked={props.done}
        onChange={props.onToggle}
        disabled={props.mutating}
      />

      {editing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ flex: 1, padding: 6 }}
        />
      ) : (
        <span
          style={{
            flex: 1,
            textDecoration: props.done ? "line-through" : "none",
          }}
        >
          {props.title}
        </span>
      )}

      {editing ? (
        <>
          <button
            disabled={props.mutating}
            onClick={() => {
              const t = value.trim();
              if (!t) return;
              props.onEdit(t);
              setEditing(false);
            }}
          >
            Save
          </button>
          <button
            disabled={props.mutating}
            onClick={() => {
              setValue(props.title);
              setEditing(false);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button disabled={props.mutating} onClick={() => setEditing(true)}>
            Edit
          </button>
          <button disabled={props.mutating} onClick={props.onDelete}>
            Delete
          </button>
        </>
      )}
    </li>
  );
}
