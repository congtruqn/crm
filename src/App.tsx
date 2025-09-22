import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/loadingSpinner/LoadingSpinner";
import "./scss/App.scss";
import MainLayout from "./layout/MainLayout";
import Customers from "./pages/Customers";

function App() {
  return (
    <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/customers" element={<Customers />} />
            </Route>
          </Routes>
        </Suspense>
    </BrowserRouter>
  )
}

export default App
