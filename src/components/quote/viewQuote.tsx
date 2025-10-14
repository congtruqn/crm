import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import type { Quote } from "../../interfaces/quote";
interface MyComponentProps {
  quoteId: string,
}

const ViewCustomer: React.FC<MyComponentProps> = ({ quoteId }: MyComponentProps)=>{
  const [data, setData] = useState<Quote>({
        _id: "string",
        customer: "string",
        customerId: "string",
        create_date: "string",
        amount: 0,
        text_amount: "string",
        items:[],
        invoiceNumber: "string",
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
  return (
    <>
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