import React, { useEffect, useRef, useState } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for units, 'a4' for format
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('document.pdf');
    }
  };
  return (
    <>
    <button onClick={generatePdf}>Generate PDF</button>
    <div ref={contentRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}

export default ViewCustomer;