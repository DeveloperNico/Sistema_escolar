import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import PrivateRoute from "./Routes/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;