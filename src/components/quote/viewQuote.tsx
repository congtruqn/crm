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
    //Allow for borders.
    const leftPosition = (window.screen.width / 2) - ((1000 / 2) + 10);
    //Allow for title and status bars.
    const topPosition = (window.screen.height / 2) - ((800 / 2) + 50);
    const winPrint = window.open('', '', 'left = '+leftPosition+',top='+topPosition+',width=1000,height=800,toolbar=0,scrollbars=0,status=0');
    if(winPrint){
      winPrint.document.write(htmlContent);
      winPrint.document.close();
      winPrint.focus();
      winPrint.print();
      winPrint.close(); 
    }

    // const originalContents = document.body.innerHTML;
    // document.body.innerHTML = htmlContent; // Replace body content with printable content
    // window.open().print(); // Trigger print dialog
    // document.body.innerHTML = originalContents; 
  };
  return (
    <>
    <button onClick={generatePdf}>Generate PDF</button>
    <div ref={contentRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}

export default ViewCustomer;