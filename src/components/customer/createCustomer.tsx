import { DatePicker, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import apiClient from "../../api/apiClient";
import type { Customers } from "../../interfaces/customer";
import dayjs from "dayjs";
import weekday from 'dayjs/plugin/weekday'; // Import the plugin
import localeData from 'dayjs/plugin/localeData'; 
import 'dayjs/locale/vi';
dayjs.locale('vi');
dayjs.extend(weekday);
dayjs.extend(localeData); 
interface MyComponentProps {
  customerId: string,
  onSubmitSuccess: (open: boolean) => void;
  onCancel: (open: boolean) => void; // Optional prop
}
const CreateCustomer: React.FC<MyComponentProps> = ({ customerId, onSubmitSuccess, onCancel }: MyComponentProps)=>{  
  const { reset, control, register, handleSubmit, setValue,  formState: { errors } } = useForm();
  const [ customerStatus, setCustomerStatus ] = useState([]);
  const [ customerEvaluation, setCustomerEvaluation ] = useState([]);
  const onSubmit = async (data : unknown) => {
    if(customerId){
      const rep = await apiClient.put('customer/'+customerId, data);
      console.log(rep);
      if(rep.status == 200){
        reset();
      }
    }
    else{
        const rep = await apiClient.post('customer', data);
        if(rep.status == 200){
          reset();
        }
    }
    onSubmitSuccess(true); // Pass form data to parent
  };
  const cancel = (data : unknown) => {
    console.log(data);
    reset();
    onCancel(true); // Pass form data to parent
  };
  const getCustomerInfo = async (customerId: string): Promise<Customers | undefined> => {
    try {
        const response = await apiClient.get('/customer/'+customerId); // Replace with your actual API endpoin
        const temp = response.data;
        if(temp){
          setValue("name", temp.name);
          setValue("demand", temp.demand);
          setValue("phone_number", temp.phone_number);
          setValue("email", temp.email);
          setValue("company", temp.company);
          setValue("address", temp.address);
          setValue("taxcode", temp.taxcode);
          setValue("customer_status", temp.customer_status_id);
          setValue("customer_evaluation", temp.customer_evaluation_id);
          //setValue("next_contact_date", moment(temp.next_contact_date));
        }
        return temp;
    } catch (err) {
      console.log(err);
    }
  };
  const getCustomerStatus = async () => {
    try {
        const response = await apiClient.get('/customer-status'); // Replace with your actual API endpoin
        const data =  response.data?.data.map((item: {_id: string, name: string}) => {
          return {
            value: item._id,
            label: item?.name || '', 
          }
        })
        setCustomerStatus(data);
    } catch (err) {
      console.log(err);
    }
  };
  const getCustomerEvaluations = async () => {
    try {
        const response = await apiClient.get('/customer-evaluations'); // Replace with your actual API endpoin
        const data =  response.data?.data.map((item: {_id: string, name: string}) => {
          return {
            value: item._id,
            label: item?.name || '', 
          }
        })
        setCustomerEvaluation(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if(customerId){
      getCustomerInfo(customerId);
    }
    else{
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, onSubmitSuccess]);
  useEffect(() => {
    getCustomerStatus();
    getCustomerEvaluations();
  }, []);
  return (
    
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Tên khách hàng
          </label>
          <div className="col-sm-12">
            <input {...register('name', { required: true })} className="form-control"/>
            {errors.name && <span className="error">Tên khách hàng bắt buộc nhập</span>}
          </div>
        </div>

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Nhu cầu
          </label>
          <div className="col-sm-12">
            <input {...register('demand', { required: true })} className="form-control"/>
            {errors.demand && <span className="error">Nhu cầu của khách hàng bắt buộc nhập</span>}
          </div>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Số điện thoại
          </label>
          <div className="col-sm-12">
            <input {...register('phone_number', { required: true })} className="form-control"/>
            {errors.phone_number && <span className="error">Số điện thoại bắt buộc nhập</span>}
          </div>
        </div>
        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Email
          </label>
          <div className="col-sm-12">
            <input {...register('email', { required: false })} className="form-control"/>
          </div>
        </div>

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Tên công ty
          </label>
          <div className="col-sm-12">
            <input {...register('company', { required: false })} className="form-control"/>
          </div>
        </div>

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Địa chỉ
          </label>
          <div className="col-sm-12">
            <input {...register('address', { required: false })} className="form-control"/>
          </div>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Mã số thuế
          </label>
          <div className="col-sm-12">
            <input {...register('taxcode', { required: false })} className="form-control"/>
          </div>
        </div>


        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Đánh giá
          </label>
          <div className="col-sm-12">
          <Controller
              name="customer_evaluation" // Name for the form field
              control={control}
              rules={{ required: true }} // React Hook Form validation rules
              render={({ field }) => (
                <Select
                  {...field} // Binds value and onChange from React Hook Form
                  placeholder="Chọn đánh giá"
                  options={customerEvaluation}
                >
                </Select>
              )}
            />
            {errors.evaluate && <span className="error">Đánh giá bắt buộc nhập</span>}
          </div>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Trạng thái
          </label>
          <div className="col-sm-12">
          <Controller
              name="customer_status" // Name for the form field
              control={control}
              rules={{ required: true }} // React Hook Form validation rules
              render={({ field }) => (
                <Select
                  {...field} // Binds value and onChange from React Hook Form
                  placeholder="Chọn trạng thái"
                  options={customerStatus}
                >
                </Select>
              )}
            />
            {errors.status && <span className="error">Trạng thái bắt buộc nhập</span>}
          </div>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Ngày liên hệ tiếp theo
          </label>
          <div className="col-sm-12">
          <Controller
              name="next_contact_date" // Name for the form field
              control={control}
              rules={{ required: false }} // React Hook Form validation rules
              render={({ field }) => (
                <DatePicker {...field} showTime  format="DD/MM/YYYY HH:mm"
                /> 
              )}
            />
          </div>
        </div>
      </div>
      <div className="clear"></div>
      <div className="panel-body">
        <button type="submit" className="btn btn-primary m-r-5 m-b-5">Lưu</button>
        <button type="button" onClick={cancel} className="btn btn-secondary m-r-5 m-b-5">Hủy</button>
      </div>
    </form>
  );
}

export default CreateCustomer;