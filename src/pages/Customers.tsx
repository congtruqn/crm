import React, { useEffect, useState } from "react";
import { Button, Drawer, Modal, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import apiClient from "../api/apiClient";
import CreateCustomer from "../components/customer/createCustomer";
import type { Customers } from "../interfaces/customer";
import { Icon } from "@iconify/react";
import moment from 'moment-timezone';
import ViewCustomer from "../components/customer/viewCustomer";
import FilterCustomer from "../components/customer/filterCustomer";
import { convertUnknownToStringArray } from "../utils";

interface DataType {
    key: React.Key;
    id: string,
    name: string;
    phone_number: string;
    evaluate: string;
}

const Customer: React.FC = ()=>{  
  const [data, setData] = useState([]);
  const [users, setUsers] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [open, setOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openViewCustomer, setOpenViewCustomer] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [keyword, setKeyword] = useState('');
  const showDrawer = () => {
    setCustomerId('');
    setOpen(true);
  };

  const showFilter = () => {
    setOpenFilter(true);
  };
  const closeFilter = () => {
    setOpenFilter(false);
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
      fetchData(pageSize, current, keyword, users);
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
      title: 'Nhân viên quản lý',
      dataIndex: 'user',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'customer_evaluation',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'customer_status',
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
  const fetchData = async (pageSize: number, pageNumber: number, keyword: string, users: string[]) => {
    try {
        const userString: string = users.map(id => `users=${encodeURIComponent(id)}`).join('&');
        const response = await apiClient.get('/customers?pageSize='+pageSize+'&pageNumber='+pageNumber+'&keyword='+keyword+'&'+userString); // Replace with your actual API endpoin
        const temp = response.data?.data.map((item: Customers, index: number) => {
          return {
            key:  item._id,
            id: item._id,
            count: ((pageNumber -1) * pageSize) + index + 1,
            name: item.name,
            phone_number: item.phone_number,
            user: item.user,
            customer_evaluation: item.customer_evaluation,
            customer_status: item.customer_status,
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
    fetchData(pagination.pageSize || 0, pagination.current || 0, keyword, users);
  }
  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value || '')
  };
  const handleCloseModal = () => setOpen(false);
  const handleFormSubmit = (formData: unknown) => {
    console.log('Form data submitted:', formData);
    handleCloseModal(); // Close modal after successful submission
    fetchData(pageSize, current, keyword, users);
  };
  const handleFilterSubmit = (formData: unknown) => {
    const myObject = formData as { users: string[] };
    //setUsers(convertUnknownToStringArray(myObject?.users || null));
    //console.log('Form data submitted:', users);
    if(myObject?.users){
      setUsers(convertUnknownToStringArray(myObject?.users));
      //fetchData(pageSize, current, keyword, users);
    } else {
      setUsers([]);
      //fetchData(pageSize, current, keyword, []);
    }
    
    closeFilter(); // Close modal after successful submission
    
  };
  useEffect(() => {
    fetchData(10,1, keyword, users);
  }, [users, keyword]);
  return (
    <section>
      <h2 className="title">{"Danh sách khách hàng"}</h2>
      <div className="panel_body_top">
        <div className="form-group col-sm-6">
          <div className="search_form">
            <Icon
              icon="fluent:search-28-filled"
              width="14"
              style={{ fontWeight: "bold" }}
            />
            <input
              type="search"
              placeholder={"Tìm theo tên hoặc SDT"}
              name="search"
              className="search_form_input"
              onChange={onSearch} 
            />
          </div>
               
        </div>
        <div className="form-group col-sm-2">
            <Button type="primary" onClick={showFilter}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd" clip-rule="evenodd"><path d="M19.5 4h-15l6 8.5V20h3v-7.5z"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M19.5 4h-15l6 8.5V20h3v-7.5z"/></g></svg>
            </Button>
            </div>
        <div>
          <Button type="primary" onClick={showDrawer}>
            Thêm khách hàng
          </Button>
        </div>
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
      <Drawer
          title="Lọc khách hàng"
          width={300}
          closable={true}
          onClose={closeFilter}
          open={openFilter}
        >
          <FilterCustomer onSubmitSuccess={handleFilterSubmit}/>
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