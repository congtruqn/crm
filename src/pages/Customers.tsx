import React, { useEffect, useState } from "react";
import { Button, Drawer, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import apiClient from "../api/apiClient";
import CreateCustomer from "../components/customer/createCustomer";

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
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const fetchData = async (pageSize: number, pageNumber: number) => {
    try {
        const response = await apiClient.get('/products1?pageSize='+pageSize+'&pageNumber='+pageNumber); // Replace with your actual API endpoin
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
    setPageSize(pagination.pageSize || 10);
    fetchData(pagination.pageSize || 0, pagination.current || 0);
  }
  const handleCloseModal = () => setOpen(false);
  const handleFormSubmit = (formData: unknown) => {
    console.log('Form data submitted:', formData);
    // Perform actions with formData, e.g., API call
    handleCloseModal(); // Close modal after successful submission
  };
  useEffect(() => {
    //fetchData(10,1);
    console.log('i fire once');
  }, [data]);
  return (
    <section>
      <h2 className="title">{"Danh sách sản phẩm"}</h2>
      <Button type="primary" onClick={showDrawer}>
        Thêm khách hàng
      </Button>
      <Table<DataType> columns={columns} dataSource={data} onChange={onChange}  pagination={{
        pageSize: pageSize,
        showSizeChanger: true,
        total: total,
        pageSizeOptions: ['10', '20', '50'],
      }}/>
      <Drawer
      
          title="Thêm mới khách hàng"
          width={900}
          closable={true}
          onClose={onClose}
          open={open}
        >
          <CreateCustomer onCancel={handleCloseModal} onSubmitSuccess={handleFormSubmit}/>
        </Drawer>
    </section>
    
  );
}

export default Products;