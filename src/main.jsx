import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Linktree from './pages/Linktree.jsx'
import Kanban from './pages/Kanban.jsx'
import NotFound from './pages/NotFound.jsx'
import Team from './pages/Team.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/linktree",
    element: <Linktree />,
  },
  {
    path: "/kanban",
    element: <Kanban />,
  },
  {
    path: "/team",
    element: <Team />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
