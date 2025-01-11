import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Manager from './components/Manager/manager';
import Supervisor from './components/Supervisor/supervisor';
import RideDetails from './components/RideDetails/RideDetails';

const routes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/manager", element: <Manager /> },
  { path: "/supervisor", element: <Supervisor /> },
  { path: "/ride-details/:ride_id/:date", element: <RideDetails /> },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
    v7_relativeSplatPath: true,
    v7_startTransition: true,
  },
});

const App = () => <RouterProvider router={router} />;

export default App;
