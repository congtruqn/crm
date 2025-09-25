import React, { useEffect, useState } from "react";
import { Button, Drawer, Modal, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import apiClient from "../api/apiClient";
import type { Customers } from "../interfaces/customer";
import { Icon } from "@iconify/react";
import CreateEventType from "../components/event/createEventType";

interface DataType {
    key: React.Key;
    id: string,
    name: string;
    phone_number: string;
    evaluate: string;
}


const EventType: React.FC = ()=>{  
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const showDrawer = () => {
    setCustomerId('');
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const showModal = () => {
    setOpenModal(true);
  };

 const comfirmDelete = async () => {
    const response = await apiClient.delete('/event-type/'+customerId);
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
      title: 'Tên loại công việc',
      dataIndex: 'name',
    },
    {
      title: 'Người tạo',
      dataIndex: 'create_user',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
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
        const response = await apiClient.get('/event-types?pageSize='+pageSize+'&pageNumber='+pageNumber); // Replace with your actual API endpoin
        const temp = response.data?.data.map((item: Customers, index: number) => {
          return {
            key:  item._id,
            id: item._id,
            count: current + index,
            name: item.name,
            create_user: item.create_name,
            create_date: item.create_date,
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
      <h2 className="title">{"Danh loại công việc"}</h2>
      <div className="panel_body_top">
        <Button type="primary" onClick={showDrawer}>
          Thêm loại công việc
        </Button>
      </div>
      <Table<DataType> columns={columns} dataSource={data} onChange={onChange}  pagination={{
        pageSize: pageSize,
        showSizeChanger: true,
        total: total,
        pageSizeOptions: ['10', '20', '50'],
      }}/>
      <Drawer
      
          title="Thêm loại công việc"
          width={900}
          closable={true}
          onClose={onClose}
          open={open}
        >
          <CreateEventType id={customerId} onCancel={handleCloseModal} onSubmitSuccess={handleFormSubmit}/>
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
        <p>Bạn chắc chắn muốn xóa loại công việc này!</p>
      </Modal>
    </section>
    
  );
}

export default EventType;