import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/loadingSpinner/LoadingSpinner";
import "./scss/App.scss";
import MainLayout from "./layout/MainLayout";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Quotes from "./pages/Quotes";
import Appointment from "./pages/Appointment";
function App() {
  return (
    <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/crm/" element={<MainLayout />}>
              <Route path="/crm/customers" element={<Customers />} />
              <Route path="/crm/products" element={<Products />} />
              <Route path="/crm/quote" element={<Quotes />} />
              <Route path="/crm/appointment" element={<Appointment />} />
              <Route path="/crm/products" element={<Products />} />
            </Route>
          </Routes>
        </Suspense>
    </BrowserRouter>
  )
}

export default App
