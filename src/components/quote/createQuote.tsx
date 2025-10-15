import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import apiClient from "../../api/apiClient";
import { Select, InputNumber } from "antd";
import { removeUnicode } from "../../utils";
//import type { Quote } from "../../interfaces/quote";
export interface SelectInterface {
    value: string
    label: string
    price?: number
    description?: string
  }
interface MyComponentProps {
  quoteId: string,
  onSubmitSuccess: (open: boolean) => void;
  onCancel: (open: boolean) => void; // Optional prop
}
const type0 = [
  "không",
  "một",
  "hai",
  "ba",
  "bốn",
  "năm",
  "sáu",
  "bảy",
  "tám",
  "chín"
];

const type1 = ["", "mươi", "trăm"];

const type2 = ["", "nghìn", "triệu", "tỷ"];

const currencyFormatter = (amount: number) => {
  const value = amount.toString();
  let result = "";
  const strs = [];
  for (let i = value.length - 1; i > -1; i -= 3) {
    let tmp = value[i];
    if (value[i - 1]) tmp = value[i - 1] + tmp;
    if (value[i - 2]) tmp = value[i - 2] + tmp;
    strs.push(tmp);
  }
  strs.forEach((v, index) => {
    if (index > type2.length) return "The number is too big";
    if (parseInt(v, 10) === 0) return;
    let count = 0;
    for (let i = v.length - 1; i > -1; i--) {
      if (i === v.length - 1) result = type2[index] + " " + result;
      if (v[i] !== "0")
        result = type0[parseInt(v[i], 10)] + " " + type1[count] + " " + result;
      count++;
    }
  });

  result = result.replaceAll("mươi năm", "mươi lăm");
  result = result.replaceAll("mươi một", "mươi mốt");
  result = result.replaceAll("một mươi", "mười");

  if (parseInt(strs[0], 10) === 0) return result + " đồng chẵn";
  return result + " đồng";
};
const CreateQuote: React.FC<MyComponentProps> = ({ quoteId , onSubmitSuccess, onCancel }: MyComponentProps)=>{
  const [products, setProducts] = useState<SelectInterface[]>([{
    value: '', label: '', price: 0, description: ''
  }]);
  const [customers, setCustomers] = useState([]);

  const { watch, reset, control, register, handleSubmit, setValue,  formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      customer_id: '',
      amount: 0,
      text_amount: '',
      items: [{ name: '', quantity: 0, product_id: '', unit:'', price: 0, total: 0, description: ''  }] // Initial item
    }
  });
  const allLineItems = watch('items') || [];
  const grandTotal = allLineItems.reduce((acc, item) => acc + (item.total || 0), 0);

  const onSearch = (data : string) => {
    getProducts(data)
  };
  const getCustomers = async (keyword: string) => {
    try {
        const response = await apiClient.get('/customers?keyword='+keyword); // Replace with your actual API endpoin
        const data =  response.data?.data.map((item: {_id: string, name: string}) => {
          return {
            value: item._id,
            label: item?.name || '', 
          }
        })
        setCustomers(data);
    } catch (err) {
      console.log(err);
    }
  };
  const getQuoteDetail = async (id: string) => {
    try {
        const response = await apiClient.get('/quote/'+id);
        for(const key in response.data){
          if(key === 'items'){
            console.log(response.data[key]);
            const items = response.data[key].map((item: { product_id: string; quantity: number; unit: string; price: number; total: number, product_more_info: [], description: string}) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              unit: item.unit,
              price: item.price,
              total: item.total,
              description: item.description,
            }));
            setValue(key, items);
            setValue('customer_id', response.data['customerId']);
            setValue('amount', response.data['amount']);
            setValue('text_amount', response.data['text_amount']);
          }
        }
    } catch (err) {
      console.log(err);
    }
  };
  const onSearchCustomer = (data : string) => {
    getCustomers(data);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const onSubmit = async (data : unknown) => {
    if(quoteId){
      const rep = await apiClient.put('quote/'+quoteId, data);
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
  const getProducts = async (keyword: string) => {
    try {
        const response = await apiClient.get('/products?keyword='+keyword); // Replace with your actual API endpoin
        const data =  response.data?.data.map((item: {_id: string, detail: { name: string, description: string }[], price: number, product_more_info: { info_value: string, info_name: string }[]}) => {
          return {
            value: item._id,
            label: item?.detail[0]?.name || '',
            price: item.price || 0,
            description: item.product_more_info?.map((it: { info_name: string, info_value: string })=> it.info_name + ': ' + it.info_value).join('\n'),
          }
        })
        setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getProducts('');
    getCustomers('');
  }, []);
  useEffect(() => {
    if(quoteId){
      getQuoteDetail(quoteId);
    }
    else{
      reset();
    }
  }, [quoteId]);
  useEffect(() => {
    setValue('amount', grandTotal);
    setValue('text_amount', currencyFormatter(grandTotal));
  }, [grandTotal, setValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Tên khách hàng
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
                  onSearch={onSearchCustomer}
                  filterOption={(input, option) =>
                    (removeUnicode(option?.label ?? '')).toLowerCase().includes(removeUnicode(input.toLowerCase()))
                  }
                >
                </Select>
              )}
            />
            {errors.customer_id && <span className="error">Vui lòng chọn khách hàng</span>}
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
                <th style={{width: '30%', textAlign: "left"}}>Sản phẩm</th>
                <th style={{width: '15%' , textAlign: "right"}}>Đơn giá</th>
                <th style={{width: '5%', textAlign: "center"}}>SL</th>
                <th style={{width: '10%'}}>ĐVT</th>
                <th style={{width: '10%' ,textAlign: "right"}}>Thành tiền</th>
                <th style={{width: '5%'}}></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td>
                  <Controller
                    name={`items.${index}.product_id`} // Name for the form field
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
                        onChange={(value) => {
                          field.onChange(value);
                          const selectedProduct = products.find(p => p.value === value);
                          setValue(`items.${index}.price`, selectedProduct?.price || 0);
                          setValue(`items.${index}.description`, selectedProduct?.description || "");
                        }}
                        filterOption={(input, option) =>
                            (removeUnicode(option?.label ?? '')).toLowerCase().includes(removeUnicode(input.toLowerCase()))
                        }
                      >
                      </Select>
                    )}
                  />
                  {errors.items?.[index]?.product_id && <span className="error">Vui lòng chọn sản phẩm</span>}
                  <textarea
                      {...register(`items.${index}.description`, { required: true, min: 1 })}
                      className="form-control"
                  ></textarea>
                  </td>

                  <td>

                  <Controller
                      name={`items.${index}.price`} // Name for the form field
                      control={control}
                      rules={{ required: 'Quantity is required', min: { value: 1, message: 'Minimum quantity is 1' } }} // Validation rules
                      
                      render={({ field }) => (
                        <>
                          <InputNumber
                            {...field} // Spreads onChange, onBlur, value, and name props
                            min={1}
                            style={{ width: '100%',textAlign: "right" }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            onChange={(e) => {
                              field.onChange(e); 
                              const quantity = e || 0;
                              const price = watch(`items.${index}.quantity`);
                              setValue(`items.${index}.total`, quantity * price);
                            }}
                            
                          />
                        </>
                      )}
                    />

                    {errors.items?.[index]?.price && <span className="error">Đơn giá không hợp lệ</span>}
                  </td>

                  <td>
                    <input
                      type="number"
                      style={{textAlign: "right" }}
                      {...register(`items.${index}.quantity`, { required: true, min: 1 })}
                      className="form-control"
                      onChange={(e) => {
                        const quantity = parseFloat(e.target.value);
                        const price = watch(`items.${index}.price`);
                        setValue(`items.${index}.total`, quantity * price);
                      }}
                    />
                    {errors.items?.[index]?.quantity && <span className="error">Số lượng không hợp lệ</span>}
                  </td>

                  <td>

                    <input
                      type="text"
                      {...register(`items.${index}.unit`, { required: true, min: 0 })}
                      className="form-control"
                    />
                    {errors.items?.[index]?.unit && <span className="error">Đơn vị tính</span>}
                  </td>
                  <td style={{textAlign: 'right', alignContent: 'left', alignItems: 'left'}}>
                  {watch(`items.${index}.total`).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} đ
                  <input
                      type="hidden"
                      {...register(`items.${index}.total`, { required: true, min: 1 })}
                      className="form-control"
                    />
                  </td>
                  <td style={{textAlign: 'left', alignContent: 'left', alignItems: 'left'}} className="table-actions">
                    <button type="button" onClick={() => remove(index)} className="btn btn-danger">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-sm-12 form-group add_more">
            <button type="button" onClick={() => append({ name: '', product_id: '', unit: '', quantity: 0 , price: 0, total: 0, description: ''})} className="btn btn-secondary m-r-5 m-b-5">Thêm SP</button>
        </div>
        <div>
          <input
            type="hidden"
            {...register(`amount`, { required: true, min: 1 })}
            className="form-control"
          />
        </div>
        <div className="clear"></div>
        <div className="amount" >
          <div>Tổng cộng: {grandTotal.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} đ</div>
          <div>Tổng cộng: {currencyFormatter(grandTotal)}</div>
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