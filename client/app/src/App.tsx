import "./App.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects/Projects";
import Project from "./pages/Projects/Project";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<Project />} />
            {/* <Route path="/items" element={<Items />} />
            <Route path="/armor" element={<Armor />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
