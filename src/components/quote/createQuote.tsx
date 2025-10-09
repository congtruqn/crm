import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import apiClient from "../../api/apiClient";
import type { Customers } from "../../interfaces/customer";
import { Select } from "antd";
import { removeUnicode } from "../../utils";
import type { Quote } from "../../interfaces/quote";
export interface SelectInterface {
    value: string
    label: string
  }
interface MyComponentProps {
  customerId: string,
  onSubmitSuccess: (open: boolean) => void;
  onCancel: (open: boolean) => void; // Optional prop
}
const CreateQuote: React.FC<MyComponentProps> = ({ customerId, onSubmitSuccess, onCancel }: MyComponentProps)=>{
  const [products, setProducts] = useState<SelectInterface[]>([{
    value: '', label: ''
  }]);
  const [invoice, setInvoice] = useState<Quote>({
    invoiceNumber: '',
    quote_details: [{
      _id: '', description: '', quantity: 1, price: 0,
      product: "",
      unit: "",
      total: 0
    }],
    _id: "string",
    customer: "string",
    customerId: "string",
    create_date: "string",
    amount: 0,
    text_amount: ","
  });
  const { watch, reset, control, register, handleSubmit, setValue,  formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      customer: '',
      items: [{ name: '', quantity: 0, product: '', unit:'',  }] // Initial item
    }
  });
  const onSearch = (data : string) => {
    getProducts(data)
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });
  const lineItems = watch('items');
  console.log(lineItems);

  const handleLineItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const { name, value } = e.target;
    const newLineItems = [...invoice.quote_details];
    newLineItems[index] = { ...newLineItems[index], [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value };
    setInvoice(prev => ({ ...prev, quote_details: newLineItems }));
  };
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
        const data =  response.data?.data.map((item: {_id: string, detail: { name: string }[], price: number,}) => {
          return {
            value: item._id,
            label: item?.detail[0]?.name || ''
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

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Email
          </label>
          <div className="col-sm-12">
            <input {...register('email', { required: false })} className="form-control"/>
          </div>
        </div>

        <div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{width: '30%'}}>Sản phẩm</th>
                <th style={{width: '10%'}}>Số lượng</th>
                <th style={{width: '20%'}}>Đơn giá</th>
                <th style={{width: '20%'}}>Thành tiền</th>
                <th style={{width: '10%'}}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td>
                  <Controller
                    name={`items.${index}.product`} // Name for the form field
                    control={control}
                    rules={{ required: true }} // React Hook Form validation rules
                    render={({ field }) => (
                      <Select
                        {...field} // Binds value and onChange from React Hook Form
                        style={{ width: '100%' }}
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
                  </td>
                  <td>
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`, { required: true, min: 1 })}
                      className="form-control"
                      onChange={(e) => handleLineItemChange(index, e)}
                    />
                    {errors.items?.[index]?.quantity && <span className="error">Số lượng không hợp lệ</span>}
                  </td>
                  <td>
                    <input
                      type="number"
                      {...register(`items.${index}.name`, { required: true, min: 0 })}
                      className="form-control"
                    />
                    {errors.items?.[index]?.name && <span className="error">Đơn giá không hợp lệ</span>}
                  </td>
                  <td>
                    {(Number((control._formValues.items?.[index]?.value || 0)) * Number((control._formValues.items?.[index]?.name || 0))).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </td>
                  <td>
                    <button type="button" onClick={() => remove(index)} className="btn btn-danger">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-sm-12 form-group">
            <button type="button" onClick={() => append({ name: '', product: '', unit: '', quantity: 0 })} className="btn btn-secondary m-r-5 m-b-5">Thêm SP</button>
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

export default CreateQuote;