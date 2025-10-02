import React, { useEffect, useState } from "react";
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import apiClient from "../api/apiClient";
import type { Noti } from "../interfaces/event";
import moment from 'moment-timezone';
interface DataType {
    key: React.Key;
    event_type: string;
    customer: string;
    create_date: string;
}
const columns: TableColumnsType<DataType> = [
    {
      title: 'Tên thông báo',
      dataIndex: 'event_type',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'create_date',
    },
  ];

const Notifications: React.FC = ()=>{  
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const fetchData = async (pageSize: number, pageNumber: number) => {
    try {
        const response = await apiClient.get('/notifications?pageSize='+pageSize+'&pageNumber='+pageNumber); // Replace with your actual API endpoin
        const temp = response.data?.data.map((item: Noti) => {
          return {
            key:  item._id,
            event_type: item?.event_type,
            customer: item.customer,
            create_date: moment(item.create_date).tz("Asia/Bangkok").format('DD/MM/YYYY HH:mm:ss') ,
          }
        })
        setData(temp);
        setTotal(response.data?.count)
    } catch (err) {
      console.log(err);
    }
  };
  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
    fetchData(pagination.pageSize || 0, pagination.current || 0);
    setPageSize(pagination.pageSize || 10);
  }
  useEffect(() => {
    fetchData(10,1);
  }, []);
  return (
    <section>
      <h2 className="title">{"Thông báo"}</h2>
      <Table<DataType> columns={columns} dataSource={data} onChange={onChange}  pagination={{
        pageSize: pageSize,
        showSizeChanger: true,
        total: total,
        pageSizeOptions: ['10', '20', '50'],
    }}/>
    </section>
  );
}

export default Notifications;