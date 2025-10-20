import React, { useEffect, useState } from "react";
import { Button, Drawer, Modal, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import apiClient from "../api/apiClient";
import { Icon } from "@iconify/react";
import moment from 'moment-timezone';
import CreateQuote from "../components/quote/createQuote";
import ViewQuote from "../components/quote/viewQuote";
import type { Quote } from "../interfaces/quote";

interface DataType {
    key: React.Key;
    id: string,
    name: string;
    phone_number: string;
    evaluate: string;
}


const Quotes: React.FC = ()=>{  
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openViewQuote, setOpenViewQuote] = useState(false);
  const [quoteId, setQuoteId] = useState('');
  const showDrawer = () => {
    setQuoteId('');
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const onViewCustomer = (id: string) => {
    setQuoteId(id);
    setOpenViewQuote(true);
  };
  const closeViewCustomer = () => {
    setOpenViewQuote(false);
  };
  const showModal = () => {
    setOpenModal(true);
  };

 const comfirmDelete = async () => {
    const response = await apiClient.delete('/quote/'+quoteId);
    if(response.status == 200){
      fetchData(pageSize, current);
      setOpenModal(false);
    }
  };
  const hideModal = () => {
    setOpenModal(false);
  };
  const handleEdit = (record: string) => {
    setQuoteId(record);
    setOpen(true);
  };
  const handleDelete = (record: string) => {
    showModal();
    setQuoteId(record);
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: '#',
      dataIndex: 'count',
      width: '25px'
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customer',
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
      title: 'Người tạo',
      dataIndex: 'user',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
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
        const response = await apiClient.get('/quotes?pageSize='+pageSize+'&pageNumber='+pageNumber); // Replace with your actual API endpoin
        const temp = response.data?.data.map((item: Quote, index: number) => {
          return {
            key:  item._id,
            id: item._id,
            count: ((current -1) * pageSize) + index + 1,
            customer: item.customer,
            user: item.user,
            amount: item.amount,
            create_date: moment(item.create_date).tz("Asia/Bangkok").format('DD/MM/YYYY HH:mm:ss'),
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
  }, []);
  return (
    <section>
      <h2 className="title">{"Danh sách báo giá"}</h2>
      <div className="panel_body_top">
        <Button type="primary" onClick={showDrawer}>
          Thêm báo giá
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
          title="Thêm báo giá"
          width={1200}
          closable={true}
          onClose={onClose}
          open={open}
        >
          <CreateQuote quoteId={quoteId} onCancel={handleCloseModal} onSubmitSuccess={handleFormSubmit}/>
      </Drawer>
      <Drawer
          title="Xem báo giá"
          width={900}
          closable={true}
          onClose={closeViewCustomer}
          open={openViewQuote}
        >
          <ViewQuote quoteId={quoteId}/>
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
        <p>Bạn chắc chắn muốn xóa báo giá này!</p>
      </Modal>
    </section>
    
  );
}

export default Quotes;