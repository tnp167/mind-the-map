import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import RoutePlanner from "./pages/RoutePlanner/RoutePlanner";
import Home from "./pages/Home/Home";
import Status from "./pages/Status/Status";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AuthProvider from "./contexts/AuthContext";
import "react-image-crop/dist/ReactCrop.css";
import RoutesProvider from "./contexts/RoutesContext";

function App() {
  return (
    <AuthProvider>
      <RoutesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/route" element={<RoutePlanner />} />
            <Route path="/status" element={<Status />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </RoutesProvider>
    </AuthProvider>
  );
}

export default App;
