import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "layouts/Layout";
import Home from "views/pages/home/Home";
import PageNotFound from "views/pages/error/page-not-found/PageNotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: "*", element: <PageNotFound /> },
        ],
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
