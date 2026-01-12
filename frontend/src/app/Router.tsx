import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/home/Home";
import TodoList from "./pages/todo-list/TodoList";
import PageNotFound from "./pages/error/page-not-found/PageNotFound";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/todo",
    element: <TodoList />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
