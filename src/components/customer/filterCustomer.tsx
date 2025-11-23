import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import apiClient from "../../api/apiClient";
import { Checkbox } from "antd";
interface MyComponentProps {
  onSubmitSuccess: (user: unknown) => void;
}
const FilterCustomer: React.FC<MyComponentProps> = ({onSubmitSuccess }: MyComponentProps)=>{  
  const { handleSubmit, control } = useForm();
  const [ employees, setEmployees] = useState([]);
  const onSubmit = async (data : unknown) => {
    onSubmitSuccess(data);
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
  useEffect(() => {
    getEmployees();
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
      <Controller
              name="users" // The name for your form field
              control={control}
              render={({ field }) => (
                <Checkbox.Group options={employees} {...field} />
              )}
            />
      

      </div>
      <div className="clear"></div>
      <div className="panel-body">
        <button type="submit" className="btn btn-primary m-r-5 m-b-5">Áp dụng</button>
      </div>
    </form>
  );
}

export default FilterCustomer;