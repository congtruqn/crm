import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/loadingSpinner/LoadingSpinner";
import "./scss/App.scss";
import MainLayout from "./layout/MainLayout";
const Customers = lazy(() => import("./pages/Customers"));
import Quotes from "./pages/Quotes";
import Appointment from "./pages/Appointment";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Works from "./pages/Works";
import EventType from "./pages/EventType";
import { LoadingProvider } from "./store/LoadingContext";
import GlobalLoader from "./components/loading/GlobalLoader";
function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable/>
    <BrowserRouter>
      <LoadingProvider>
        <GlobalLoader></GlobalLoader>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/crm/" element={<MainLayout />}>
              <Route path="/crm/event-types" element={<EventType />} />
              <Route path="/crm/customers" element={<Customers />} />
              <Route path="/crm/works" element={<Works />} />
              <Route path="/crm/quote" element={<Quotes />} />
              <Route path="/crm/appointment" element={<Appointment />} />
            </Route>
          </Routes>
        </Suspense>
      </LoadingProvider>
    </BrowserRouter>
    </>
  )
}

export default App
