import React, { useEffect, useState } from "react";
import { Button, Drawer, Modal, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import apiClient from "../api/apiClient";
import CreateCustomer from "../components/customer/createCustomer";
import { getCustomerStatus, getEvaluate } from "../constants/masterData";
import type { Customers } from "../interfaces/customer";
import { Icon } from "@iconify/react";
import moment from 'moment-timezone';
import ViewCustomer from "../components/customer/viewCustomer";

interface DataType {
    key: React.Key;
    id: string,
    name: string;
    phone_number: string;
    evaluate: string;
}


const Customer: React.FC = ()=>{  
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openViewCustomer, setOpenViewCustomer] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const showDrawer = () => {
    setCustomerId('');
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const onViewCustomer = (id: string) => {
    setCustomerId(id);
    setOpenViewCustomer(true);
  };
  const closeViewCustomer = () => {
    setOpenViewCustomer(false);
  };
  const showModal = () => {
    setOpenModal(true);
  };

 const comfirmDelete = async () => {
    const response = await apiClient.delete('/customer/'+customerId);
    if(response.status == 200){
      fetchData(pageSize, current);
      setOpenModal(false);
    }
  };
  const hideModal = () => {
    setOpenModal(false);
  };
  const handleEdit = (record: string) => {
    setCustomerId(record);
    setOpen(true);
  };
  const handleDelete = (record: string) => {
    showModal();
    setCustomerId(record);
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: '#',
      dataIndex: 'count',
      width: '25px'
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'name',
      onCell: (record) => {
        return {
          onClick: ()=> {
            onViewCustomer(record?.id);
            //console.log('Clicked Address cell:', record, rowIndex);
            // Perform actions specific to the Address column
          },
        };
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phone_number',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'evaluate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Ngày liên hệ tiếp theo',
      dataIndex: 'next_contact_date',
    },
    {
      title: '',
      key: 'edit',
      width: '15px',
      render: (_: unknown, record: DataType) => (
        <>
          <Icon icon={'mingcute:edit-line'} onClick={() => handleEdit(record.id)}/>
        </>
      ),
    },
    {
      title: '',
      key: 'delete',
      width: '15px',
      render: (_: unknown, record: DataType) => (
        <>
          <Icon icon={'material-symbols:delete-outline'} onClick={() => handleDelete(record.id)}/>
        </>
      ),
    },
];
  const fetchData = async (pageSize: number, pageNumber: number) => {
    try {
        const response = await apiClient.get('/customers?pageSize='+pageSize+'&pageNumber='+pageNumber); // Replace with your actual API endpoin
        const temp = response.data?.data.map((item: Customers, index: number) => {
          return {
            key:  item._id,
            id: item._id,
            count: current + index,
            name: item.name,
            phone_number: item.phone_number,
            evaluate: getEvaluate(item.evaluate),
            status: getCustomerStatus(item.status),
            next_contact_date: moment(item.next_contact_date).tz("Asia/Bangkok").format('DD/MM/YYYY HH:mm:ss'),

          }
        })
        setData(temp);
        setTotal(response.data?.count)
    } catch (err) {
      console.log(err);
    }
  };
  const onChange: TableProps<DataType>['onChange'] = (pagination) => {
    setPageSize(pagination.pageSize || 10);
    setCurrent(pagination.current || 1);
    fetchData(pagination.pageSize || 0, pagination.current || 0);
  }
  const handleCloseModal = () => setOpen(false);
  const handleFormSubmit = (formData: unknown) => {
    console.log('Form data submitted:', formData);
    // Perform actions with formData, e.g., API call
    handleCloseModal(); // Close modal after successful submission
    fetchData(pageSize, current);
  };
  useEffect(() => {
    fetchData(10,1);
  }, [current, pageSize]);
  return (
    <section>
      <h2 className="title">{"Danh sách khách hàng"}</h2>
      <div className="panel_body_top">
        <Button type="primary" onClick={showDrawer}>
          Thêm khách hàng
        </Button>
      </div>
      <Table<DataType> columns={columns} dataSource={data} onChange={onChange}
              // onRow={(record) => {
              //   return {
              //     onClick: () => {
              //       console.log(record)
              //       onViewCustomer(record?.id);
              //     },
              //   };
              // }}
      pagination={{
        pageSize: pageSize,
        showSizeChanger: true,
        total: total,
        pageSizeOptions: ['10', '20', '50'],
        
      }}/>
      <Drawer
          title="Thêm khách hàng"
          width={900}
          closable={true}
          onClose={onClose}
          open={open}
        >
          <CreateCustomer customerId={customerId} onCancel={handleCloseModal} onSubmitSuccess={handleFormSubmit}/>
      </Drawer>
      <Drawer
          title="Thông tin khách hàng"
          width={900}
          closable={true}
          onClose={closeViewCustomer}
          open={openViewCustomer}
        >
          <ViewCustomer customerId={customerId}/>
      </Drawer>
      <Modal
        title=""
        open={openModal}
        onOk={comfirmDelete}
        onCancel={hideModal}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        
        <h3 className="comfirm_title"><Icon icon={'material-symbols:warning'} /> <label>Xác nhận</label></h3>
        <p>Bạn chắc chắn muốn xóa khách hàng này!</p>
      </Modal>
    </section>
    
  );
}

export default Customer;