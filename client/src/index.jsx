import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";

let router = createBrowserRouter([
    {
        path: "/:id",
        element: <App/>,

    },
    {
        path: '*',
        element: <Navigate to={`f${(+new Date()).toString(16)}`} replace />
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </RouterProvider>
);

