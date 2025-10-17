import React, { useEffect, useRef, useState } from "react";
import { useMyStore } from "../../store/userStore";
import type { User } from "../../interfaces/user";
interface MyComponentProps {
  quoteId: string,
}

const ViewCustomer: React.FC<MyComponentProps> = ({ quoteId }: MyComponentProps)=>{
  const [htmlContent, setHtmlContent] = useState('');
  const value:User = useMyStore((state ) => state.value);
  const contentRef = useRef(null);
  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}`+'/view-quote?customer_id=+'+value.customer_id+'+&quoteId='+quoteId);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setHtmlContent(text);
      } catch (e) {
        //setError(e);
        console.error("Failed to fetch HTML:", e);
      }
    };

    fetchHtml();
  }, []);
  const generatePdf = async () => {
    document.body.innerHTML = htmlContent; // Replace body content with printable content
    window.print(); // Trigger print dialog
    document.body.innerHTML = htmlContent;
  };
  return (
    <>
    <button onClick={generatePdf}>Generate PDF</button>
    <div ref={contentRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}

export default ViewCustomer;