import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import type { Customers } from "../../interfaces/customer";
import { Table, type TableColumnsType, type TableProps } from "antd";
import { getCustomerStatus, getEvaluate } from "../../constants/masterData";
import type { Events } from "../../interfaces/event";
import moment from "moment";
interface MyComponentProps {
  customerId: string,
}

const ViewCustomer: React.FC<MyComponentProps> = ({ customerId }: MyComponentProps)=>{
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [ current, setCurrent] = useState(1);
  const [ datas, setDatas ] = useState([]);
  interface DataType {
    key: React.Key;
    id: string,
    name: string;
    event_type: string;
    user: string;
    processed: string;
    from_date: string;
  }
  const columns: TableColumnsType<DataType> = [
    {
      title: '#',
      dataIndex: 'count',
      width: '25px'
    },
    {
      title: 'Công việc',
      dataIndex: 'event_type',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'user',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'processed',
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'from_date',
    },
  ];
  const [data, setData] = useState<Customers>({
    _id: "",
    phone_number: "",
    name: "",
    email: "",
    company: "",
    address: "",
    status: 0,
    taxcode: "",
    next_contact_date: "",
    demand: "",
    customer_id: 0,
    evaluate: 0,
    create_user: "",
    create_name: "",
    create_date: ""
  });
  const onChange: TableProps<DataType>['onChange'] = (pagination) => {
      setPageSize(pagination.pageSize || 10);
      setCurrent(pagination.current || 1);
      //fetchData(pagination.pageSize || 0, pagination.current || 0);
  }
  const getCustomerInfo = async (customerId: string): Promise<void> => {
    try {
        const response = await apiClient.get('/customer/'+customerId); // Replace with your actual API endpoin
        const temp = response.data;
        setData(temp)
    } catch (err) {
      console.log(err);
    }
  };
  const fetchData = async (pageSize: number, pageNumber: number) => {
    try {
        const response = await apiClient.get('/events?pageSize='+pageSize+'&pageNumber='+pageNumber); // Replace with your actual API endpoin
        const temp = response.data?.data.map((item: Events, index: number) => {
          return {
            key:  item._id,
            id: item._id,
            count: current + index,
            customer: item.customer,
            event_type: item.event_type,
            user: item.user,
            processed: item.processed,
            from_date: moment(item.from_date).tz("Asia/Bangkok").format('DD/MM/YYYY HH:mm:ss'),
          }
        })
        setDatas(temp);
        setTotal(response.data?.count)
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if(customerId){
      getCustomerInfo(customerId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);
  useEffect(() => {
      fetchData(10,1);
  }, [current, pageSize]);
  return (
    <>
      <div className="row">

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Tên khách hàng : <strong>{data.name}</strong>
          </label>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Nhu cầu: <strong>{data.demand}</strong>
          </label>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Số điện thoại: <strong>{data.phone_number}</strong>
          </label>
        </div>
        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Email: <strong>{data.email}</strong>
          </label>
        </div>

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Tên công ty: <strong>{data.company}</strong>
          </label>
        </div>

        <div className="form-group col-sm-12">
          <label className="col-sm-12 control-label">
            Địa chỉ: <strong>{data.address}</strong>
          </label>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Mã số thuế: <strong>{data.taxcode}</strong>
          </label>
        </div>


        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Đánh giá: <strong>{getEvaluate(data.evaluate)}</strong>
          </label>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Trạng thái: <strong>{getCustomerStatus(data.status)}</strong>
          </label>
        </div>

        <div className="form-group col-sm-6">
          <label className="col-sm-12 control-label">
            Ngày liên hệ tiếp theo:  <strong>{data.next_contact_date}</strong>
          </label>
        </div>
        <div className="clear"></div>
        <div className="customer_table">
          <Table<DataType> columns={columns} dataSource={datas} onChange={onChange}  pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            total: total,
            pageSizeOptions: ['10', '20', '50'],
          }}/>
        </div>
      </div>
    </>
  );
}

export default ViewCustomer;