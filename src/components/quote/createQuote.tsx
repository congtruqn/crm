import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import apiClient from "../../api/apiClient";
import type { Customers } from "../../interfaces/customer";
import { Select } from "antd";
import { removeUnicode } from "../../utils";
interface MyComponentProps {
  customerId: string,
  onSubmitSuccess: (open: boolean) => void;
  onCancel: (open: boolean) => void; // Optional prop
}
const CreateQuote: React.FC<MyComponentProps> = ({ customerId, onSubmitSuccess, onCancel }: MyComponentProps)=>{
  const [products, setProducts] = useState([]);
  const { reset, control, register, handleSubmit, setValue,  formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      customer: '',
      items: [{ name: '', value: '', product: '' }] // Initial item
    }
  });
  const onSearch = (data : string) => {
    getProducts(data)
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const onSubmit = async (data : unknown) => {
    if(customerId){
      const rep = await apiClient.put('customer/'+customerId, data);
      console.log(rep);
      if(rep.status == 200){
        reset();
      }
    }
    else{
        const rep = await apiClient.post('quote', data);
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
          setValue("customer", temp.name);
          setValue("email", temp.email);
        }
        return temp;
    } catch (err) {
      console.log(err);
    }
  };
  const getProducts = async (keyword: string) => {
    try {
        const response = await apiClient.get('/products?keyword='+keyword); // Replace with your actual API endpoin
        const data =  response.data?.data.map((item: {_id: string, detail: { name: string }[]}) => {
          return {
            value: item._id,
            label: item?.detail[0]?.name || '', 
          }
        })
        setProducts(data);
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
    getProducts('');
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">


        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Tên khách hàng
          </label>
          <div className="col-sm-12">
            <input {...register('customer', { required: true })} className="form-control"/>
            {errors.customer && <span className="error">Tên khách hàng bắt buộc nhập</span>}
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


        {fields.map((field, index) => (
          <div key={field.id}> {/* field.id is essential for React's key prop */}
            <div className="col-sm-12 form-group">
              <Controller
                  name={`items.${index}.product`} // Name for the form field
                  control={control}
                  rules={{ required: true }} // React Hook Form validation rules
                  render={({ field }) => (
                    <Select
                      {...field} // Binds value and onChange from React Hook Form
                      placeholder="Chọn công việc"
                      options={products}
                      showSearch
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                          (removeUnicode(option?.label ?? '')).toLowerCase().includes(removeUnicode(input.toLowerCase()))
                      }
                    >
                    </Select>
                  )}
                />
                {errors.items?.[index]?.product && <span className="error">Vui lòng chọn sản phẩm</span>}
                <button type="button" onClick={() => remove(index)}>Xóa</button>
            </div>
            
          </div>
        ))}

<button type="button" onClick={() => append({ name: '', value: "", product: '' })} className="btn btn-secondary m-r-5 m-b-5">Thêm SP</button>


      </div>
      <div className="clear"></div>
      <div className="panel-body">
        <button type="submit" className="btn btn-primary m-r-5 m-b-5">Lưu</button>
        <button type="button" onClick={cancel} className="btn btn-secondary m-r-5 m-b-5">Hủy</button>
      </div>
    </form>
  );
}

export default CreateQuote;