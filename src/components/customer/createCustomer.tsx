import { Select } from "antd";
import React from "react";
import { useForm } from "react-hook-form";
const { Option } = Select;
interface MyComponentProps {
  onSubmitSuccess: (open: boolean) => void;
  onCancel: (open: boolean) => void; // Optional prop
}
const CreateCustomer: React.FC<MyComponentProps> = ({ onSubmitSuccess, onCancel }: MyComponentProps)=>{  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data : unknown) => {
    console.log(data);
    onSubmitSuccess(true); // Pass form data to parent
  };
  const cancel = (data : unknown) => {
    console.log(data);
    onCancel(true); // Pass form data to parent
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="col-sm-12 control-label">
          Tên khách hàng
        </label>
        <div className="col-sm-12">
          <input {...register('name', { required: true })} className="form-control"/>
          {errors.name && <span className="error">This field is required</span>}
        </div>
      </div>
      <div className="form-group">
        <label className="col-sm-12 control-label">
          Tên khách hàng
        </label>
        <div className="col-sm-12">
        <Select placeholder="Please select an owner">
                  <Option value="xiao">Xiaoxiao Fu</Option>
                  <Option value="mao">Maomao Zhou</Option>
                </Select>
          {errors.name && <span className="error">This field is required</span>}
        </div>
      </div>
      <div className="panel-body">
        <button type="submit" className="btn btn-primary m-r-5 m-b-5">Lưu</button>
        <button type="button" onClick={cancel} className="btn btn-primary m-r-5 m-b-5">Hủy</button>
      </div>
    </form>
  );
}

export default CreateCustomer;