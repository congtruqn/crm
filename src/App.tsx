import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/loadingSpinner/LoadingSpinner";
import "./scss/App.scss";
import MainLayout from "./layout/MainLayout";
import Quotes from "./pages/Quotes";
import Appointment from "./pages/Appointment";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Works from "./pages/Works";
import EventType from "./pages/EventType";
import { LoadingProvider } from "./store/LoadingContext";
import GlobalLoader from "./components/loading/GlobalLoader";
import { onMessageListener, requestForToken } from "./config/firebase-config"
import { useNotiStore } from "./store/notiStore";
import type { User } from "./interfaces/user";
import { useMyStore } from "./store/userStore";
import apiClient from "./api/apiClient";
import Notifications from "./pages/Notifications";
import Customers from "./pages/Customers";
import CustomerStatus from "./pages/CustomerStatus";
import CustomerEvaluation from "./pages/CustomerEvaluation";

function App() {
  const user:User = useMyStore((state ) => state.value);
  const value = useNotiStore((state ) => state.value);
  const { setValue } = useNotiStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fcm_token = await requestForToken()
        if(fcm_token != user.fcm_token || !user.fcm_token){
          await apiClient.put('user-fmc-token/'+user._id, { fcm_token: fcm_token });
          console.log("Token already saved in database.")
        }
      } catch (err) {
        console.error('Fetch error: ', err);
      } finally { /* empty */ }
    };
    const getNoti = async () => {
      try {
          const noti = await apiClient.get('notifications');
          if(noti){
            setValue(noti.data?.unRead || 0);
          }
      } catch (err) {
        console.error('Fetch error: ', err);
      } finally { /* empty */ }
    };
    fetchData()
    getNoti();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    onMessageListener().then((data) => {
      const num  = value + 1;
      setValue(num);
      console.log("Receive foreground: ",data)
    })
  })
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
              <Route path="/crm/notifications" element={<Notifications />} />
              <Route path="/crm/customer-status" element={<CustomerStatus />} />
              <Route path="/crm/customer-evaluations" element={<CustomerEvaluation />} />
            </Route>
          </Routes>
        </Suspense>
      </LoadingProvider>
    </BrowserRouter>
    </>
  )
}

export default App
