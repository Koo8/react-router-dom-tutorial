import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Root, {
  loader as rootLoader,
  action as rootAction,
} from './routes/root';
import { loader as contactLoader } from './routes/contact';
import { action as editAction } from './routes/edit';
import ErrorPage from './error-page';
import Contact, { action as favAction } from './routes/contact';
import EditContact from './routes/edit';
import { destoryAction } from './routes/destroy';
import Index from './routes';

// create a Browser Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader, //React Router automatically keep data in sync with UI thru useLoaderData
    action: rootAction, // <Form> methods should only be post, delete etc, not get, Get won't trigger action
    children: [
      {
        // pathless route
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: 'contacts/:contactId', // url params will be recorded into the loader of this route, its key is 'params', so 'params.contactId' is the data passed
            loader: contactLoader,
            action: favAction,
            element: <Contact />,
          },
          {
            path: 'contacts/:contactId/edit',
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: 'contacts/:contactId/destroy',
            action: destoryAction,
            errorElement: (
              <div>
                Something went wrong when you tried to delete this memeber.
              </div>
            ),
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
