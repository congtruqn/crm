import React from "react";
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}
const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
    },
];
const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.name.includes(value as string),
      width: '30%',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      onFilter: (value, record) => record.address.startsWith(value as string),
      filterSearch: true,
      width: '40%',
    },
  ];
  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  }
const Customers: React.FC = ()=>{  

  return (
    <section>
      <h2 className="title">{"Khách hàng 1"}</h2>
      <Table<DataType> columns={columns} dataSource={data} onChange={onChange}  pagination={{
        pageSize: 10,
        showSizeChanger: true,
        total: 100,
        pageSizeOptions: ['10', '20', '50'],
    }}/>
    </section>
  );
}

export default Customers;