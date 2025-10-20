import { DatePicker, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import apiClient from "../../api/apiClient";
import type { Customers } from "../../interfaces/customer";
import { removeUnicode } from "../../utils";
import dayjs from "dayjs";
import weekday from 'dayjs/plugin/weekday'; // Import the plugin
import localeData from 'dayjs/plugin/localeData'; 
import 'dayjs/locale/vi';
dayjs.locale('vi');
dayjs.extend(weekday);
dayjs.extend(localeData); 
import { useDateStore } from "../../store/dateStore";
interface MyComponentProps {
  id: string,
  onSubmitSuccess: (open: boolean) => void;
  onCancel: (open: boolean) => void; // Optional prop
}
const CreateEvent: React.FC<MyComponentProps> = ({ id, onSubmitSuccess, onCancel }: MyComponentProps)=>{ 
  const from = useDateStore((state ) => state.from);
  const to = useDateStore((state ) => state.to);
  const { reset, control, register, handleSubmit, setValue,  formState: { errors } } = useForm();
  const [evenTypes, setEvenTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const onSubmit = async (data : unknown) => {

    if(id){
      if(typeof data == 'object'){
        const rep = await apiClient.put('event/'+id, { from, to, ...data });
        if(rep.status == 200){
          reset();
        }
      }
    }
    else{
      if(typeof data == 'object'){
        const rep = await apiClient.post('event', { from, to, ...data });
        if(rep.status == 200){
          reset();
        }
      }

    }
    onSubmitSuccess(true); // Pass form data to parent
  };
  const cancel = (data : unknown) => {
    console.log(data);
    reset();
    onCancel(true); // Pass form data to parent
  };
  const onSearch = (data : string) => {
    getCustomers(data)
  };
  
  const getData = async (id: string): Promise<Customers | undefined> => {
    try {
        const response = await apiClient.get('/event/'+id); // Replace with your actual API endpoin
        const temp = response.data;
        if(temp){
          setValue("event_type_id", temp.event_type?._id);
          setValue("customer_id", temp.customer?._id);
          setValue("note", temp.note);
          setValue("user_id", temp.user?._id);
          setValue("phone_number", temp.phone_number);
          setValue("is_notice", temp.is_notice);
          setValue("processed", temp.processed);
          setValue("event_date", dayjs(temp.from_date));
        }
        return temp;
    } catch (err) {
      console.log(err);
    }
  };
  const getEventType = async () => {
    try {
        const response = await apiClient.get('/event-types'); // Replace with your actual API endpoin
        const data =  response.data?.data.map((item: {_id: string, name: string}) => {
          return {
            value: item._id,
            label: item?.name || '', 
          }
        })
        setEvenTypes(data);
    } catch (err) {
      console.log(err);
    }
  };
  const getEmployees = async () => {
    try {
        const response = await apiClient.get('/employees'); // Replace with your actual API endpoin
        const data =  response.data?.data.map((item: {_id: string, name: string}) => {
          return {
            value: item._id,
            label: item?.name || '', 
          }
        })
        setEmployees(data);
    } catch (err) {
      console.log(err);
    }
  };
  const getCustomers = async (keyword: string) => {
    try {
        const response = await apiClient.get('/customers?keyword='+keyword); // Replace with your actual API endpoin
        const data =  response.data?.data.map((item: {_id: string, name: string, phone_number: string}) => {
          return {
            value: item._id,
            label: item?.name + ' - ' + item?.phone_number || '', 
          }
        })
        setCustomers(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getEventType()
    getEmployees()
    getCustomers('')
  }, []);
  useEffect(() => {
    if(id && employees && evenTypes && customers){
      getData(id);
    }
    else{
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onSubmitSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Công việc
          </label>
          <div className="col-sm-12">
          <Controller
              name="event_type_id" // Name for the form field
              control={control}
              rules={{ required: true }} // React Hook Form validation rules
              render={({ field }) => (
                <Select
                  {...field} // Binds value and onChange from React Hook Form
                  placeholder="Chọn công việc"
                  options={evenTypes}
                >
                </Select>
              )}
            />
            {errors.status && <span className="error">Vui lòng chọn công việc</span>}
          </div>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Khách hàng
          </label>
          <div className="col-sm-12">
          <Controller
              name="customer_id" // Name for the form field
              control={control}
              rules={{ required: true }} // React Hook Form validation rules
              render={({ field }) => (
                <Select
                  {...field} // Binds value and onChange from React Hook Form
                  placeholder="Chọn khách hàng"
                  options={customers}
                  showSearch
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    (removeUnicode(option?.label ?? '')).toLowerCase().includes(removeUnicode(input.toLowerCase()))
                  }
                >
                </Select>
              )}
            />
            {errors.status && <span className="error">Vui lòng chọn khách hàng</span>}
          </div>
        </div>

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Nhân viên thực hiện
          </label>
          <div className="col-sm-12">
          <Controller
              name="user_id" // Name for the form field
              control={control}
              rules={{ required: false }} // React Hook Form validation rules
              render={({ field }) => (
                <Select
                  {...field} // Binds value and onChange from React Hook Form
                  placeholder="Chọn đánh giá"
                  options={employees}
                >
                </Select>
              )}
            />
          </div>
        </div>       

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Ghi chú
          </label>
          <div className="col-sm-12">
            <textarea {...register('note', { required: false })} className="form-control"/>
            {errors.note && <span className="error">Nhu cầu của khách hàng bắt buộc nhập</span>}
          </div>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Số điện thoại
          </label>
          <div className="col-sm-12">
            <input {...register('phone_number', { required: false })} className="form-control"/>
          </div>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Tạo nhắc lịch
          </label>
          <div className="col-sm-12">
          <Controller
              name="is_notice" // Name for the form field
              control={control}
              rules={{ required: false }} // React Hook Form validation rules
              render={({ field }) => (
                <Select
                  {...field} // Binds value and onChange from React Hook Form
                  placeholder="Chọn"
                  options={[
                    { value: 0 , label: 'Không'},
                    { value: 1 , label: 'Có'},
                  ]}
                  defaultValue={0}
                >
                </Select>
              )}
            />
          </div>
        </div>



        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Ngày thực hiện
          </label>
          <div className="col-sm-12">
          <Controller
              name="event_date" // Name for the form field
              control={control}
              rules={{ required: true }} // React Hook Form validation rules
              defaultValue={dayjs()}
              render={({ field }) => (
                <DatePicker {...field} showTime />
              )}
            />
            {errors.event_date && <span className="error">Thời gian thực hiện không được để trống</span>}
          </div>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Trạng thái
          </label>
          <div className="col-sm-12">
          <Controller
              name="processed" // Name for the form field
              control={control}
              rules={{ required: false }} // React Hook Form validation rules
              render={({ field }) => (
                <Select
                  {...field} // Binds value and onChange from React Hook Form
                  placeholder="Chọn"
                  options={[
                    { value: 0 , label: 'Chưa hoàn thành'},
                    { value: 1 , label: 'Đã hoàn thành'},
                  ]}
                  defaultValue={0}
                >
                </Select>
              )}
            />
            {errors.status && <span className="error">Vui lòng chọn công việc</span>}
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

export default CreateEvent;