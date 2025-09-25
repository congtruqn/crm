import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../../api/apiClient";
import type { Customers } from "../../interfaces/customer";
interface MyComponentProps {
  id: string,
  onSubmitSuccess: (open: boolean) => void;
  onCancel: (open: boolean) => void; // Optional prop
}
const CreateEventType: React.FC<MyComponentProps> = ({ id, onSubmitSuccess, onCancel }: MyComponentProps)=>{  
  const { reset, register, handleSubmit, setValue,  formState: { errors } } = useForm();
  const onSubmit = async (data : unknown) => {
    if(id){
      const rep = await apiClient.put('/event-type/'+id, data);
      if(rep.status == 200){
        reset();
      }
    }
    else{
        const rep = await apiClient.post('event-type', data);
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
  const getData = async (id: string): Promise<Customers | undefined> => {
    try {
        const response = await apiClient.get('/event-type/'+id); // Replace with your actual API endpoin
        const temp = response.data;
        if(temp){
          setValue("name", temp.name);
        }
        return temp;
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if(id){
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

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Tên lọai công việc
          </label>
          <div className="col-sm-12">
            <input {...register('name', { required: true })} className="form-control"/>
            {errors.name && <span className="error">This field is required</span>}
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

export default CreateEventType;