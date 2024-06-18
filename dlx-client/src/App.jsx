import { BrowserRouter, Route, Routes } from "react-router-dom";
import Deeplink from "../pages/deeplink";
import Services from "../pages/services";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/deeplink" element={<Deeplink />} />
        <Route path="/" element={<Services />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
