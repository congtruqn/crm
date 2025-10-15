import React, { useEffect, useRef, useState } from "react";
import apiClient from "../../api/apiClient";
import type { Quote } from "../../interfaces/quote";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
interface MyComponentProps {
  quoteId: string,
}

const ViewCustomer: React.FC<MyComponentProps> = ({ quoteId }: MyComponentProps)=>{
  const [htmlContent, setHtmlContent] = useState('');
  const contentRef = useRef(null);
  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API}`+'/view-quote');
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
  const [data, setData] = useState<Quote>({
        _id: "",
        customer: "",
        customerId: "",
        create_date: "",
        amount: 0,
        text_amount: "",
        user: "",
        items:[],
        invoiceNumber: "",
  });
  const getCustomerInfo = async (customerId: string): Promise<void> => {
    try {
        const response = await apiClient.get('/quote/'+customerId); // Replace with your actual API endpoin
        const temp = response.data;
        setData(temp)
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if(quoteId){
      getCustomerInfo(quoteId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId]);
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
      <div className="row">

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Tên khách hàng : <strong>{data?.customer}</strong>
          </label>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Nhu cầu: <strong>{data?.amount}</strong>
          </label>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Số điện thoại: <strong>{data?.text_amount}</strong>
          </label>
        </div>
        <div className="clear"></div>
      </div>
    </>
  );
}

export default ViewCustomer;