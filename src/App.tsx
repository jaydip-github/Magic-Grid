import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Form from "./components/Form";
import MagicGrid from "./components/MagicGrid";
import { NAVIGATION_CONSTANT } from "./constants/navigation.constants";
import "./App.css";

function App() {
  const router = createBrowserRouter([
    {
      path: NAVIGATION_CONSTANT.FORM,
      element: <Form />,
    },
    {
      path: NAVIGATION_CONSTANT.MAGIC_GRID,
      element: <MagicGrid />,
    },
  ]);
  return (
    <div className="App" id="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
