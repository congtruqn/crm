import React, { useEffect, useState } from "react";
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import apiClient from "../api/apiClient";

interface DataType {
    key: React.Key;
    name: string;
    price: number;
    parent_name: string;
}
const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'price',
    },
    {
      title: 'Address',
      dataIndex: 'parent_name',
    },
  ];

const Products: React.FC = ()=>{  
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const fetchData = async (pageSize: number, pageNumber: number) => {
    try {
        const response = await apiClient.get('/products?pageSize='+pageSize+'&pageNumber='+pageNumber); // Replace with your actual API endpoin
        const temp = response.data?.data.map((item: { _id: unknown; detail: { name: unknown; }[]; }) => {
          return {
            key:  item._id,
            name: item?.detail[0]?.name,
            price: 32,
            parent_name: 'New York No. 1 Lake Park',
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
      <h2 className="title">{"Danh sách sản phẩm"}</h2>
      <Table<DataType> columns={columns} dataSource={data} onChange={onChange}  pagination={{
        pageSize: pageSize,
        showSizeChanger: true,
        total: total,
        pageSizeOptions: ['10', '20', '50'],
    }}/>
    </section>
  );
}

export default Products;