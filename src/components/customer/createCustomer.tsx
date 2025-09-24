import { DatePicker, Select } from "antd";
import React from "react";
import { Controller, useForm } from "react-hook-form";
interface MyComponentProps {
  onSubmitSuccess: (open: boolean) => void;
  onCancel: (open: boolean) => void; // Optional prop
}
const CreateCustomer: React.FC<MyComponentProps> = ({ onSubmitSuccess, onCancel }: MyComponentProps)=>{  
  const { control, register, handleSubmit, formState: { errors } } = useForm();
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
      <div className="row">

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Tên khách hàng
          </label>
          <div className="col-sm-12">
            <input {...register('name', { required: true })} className="form-control"/>
            {errors.name && <span className="error">This field is required</span>}
          </div>
        </div>

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Nhu cầu
          </label>
          <div className="col-sm-12">
            <input {...register('demand', { required: true })} className="form-control"/>
            {errors.name && <span className="error">Nhu cầu của khách hàng bắt buộc nhập</span>}
          </div>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Số điện thoại
          </label>
          <div className="col-sm-12">
            <input {...register('phone_number', { required: true })} className="form-control"/>
            {errors.name && <span className="error">Số điện thoại bắt buộc nhập</span>}
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
              name="evulate" // Name for the form field
              control={control}
              rules={{ required: true }} // React Hook Form validation rules
              render={({ field }) => (
                <Select
                  {...field} // Binds value and onChange from React Hook Form
                  placeholder="Chọn đánh giá"
                  options={[
                    {
                      value: 1,
                      label: 'Tiềm năng',
                    },
                    {
                      value: 2,
                      label: 'Đang sử dụng',
                    },
                    {
                      value: 3,
                      label: 'Chưa triển khai',
                    },
                    {
                      value: 4,
                      label: 'Ngừng triển khai',
                    },
                  ]}
                >
                </Select>
              )}
            />
            {errors.evulate && <span className="error">This field is required</span>}
          </div>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Trạng thái
          </label>
          <div className="col-sm-12">
          <Controller
              name="status" // Name for the form field
              control={control}
              rules={{ required: true }} // React Hook Form validation rules
              render={({ field }) => (
                <Select
                  {...field} // Binds value and onChange from React Hook Form
                  placeholder="Chọn đánh giá"
                  options={[
                    {
                      value: 1,
                      label: 'Tiềm năng',
                    },
                    {
                      value: 2,
                      label: 'Đang sử dụng',
                    },
                    {
                      value: 3,
                      label: 'Chưa triển khai',
                    },
                    {
                      value: 4,
                      label: 'Ngừng triển khai',
                    },
                  ]}
                >
                </Select>
              )}
            />
            {errors.status && <span className="error">This field is required</span>}
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
              rules={{ required: true }} // React Hook Form validation rules
              render={({ field }) => (
                <DatePicker {...field} showTime />
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