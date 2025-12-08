import React, { useEffect, useState } from "react";
import { Button, Drawer, Modal, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import apiClient from "../api/apiClient";
import { Icon } from "@iconify/react";
import CreateEvent from "../components/event/createEvent";
import type { Events } from "../interfaces/event";
import moment from 'moment-timezone';
import FilterCustomer from "../components/customer/filterCustomer";
import { convertUnknownToStringArray } from "../utils";
interface DataType {
    key: React.Key;
    id: string,
    name: string;
    phone_number: string;
    evaluate: string;
}


const Works: React.FC = ()=>{  
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState('');
  const [openFilter, setOpenFilter] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const showFilter = () => {
    setOpenFilter(true);
  };
  const closeFilter = () => {
    setOpenFilter(false);
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const showModal = () => {
    setOpenModal(true);
  };
  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value || '')
  };
  const comfirmDelete = async () => {
    const response = await apiClient.delete('/event/'+id);
    if(response.status == 200){
      fetchData(pageSize, current,keyword, users);
      setOpenModal(false);
    }
  };
  const hideModal = () => {
    setOpenModal(true);
  };
  const handleEdit = (record: string) => {
    setId(record);
    showDrawer();
  };
  const handleDelete = (record: string) => {
    showModal();
    setId(record);
  };
  const handleFilterSubmit = (formData: unknown) => {
      const myObject = formData as { users: string[] };
      if(myObject?.users){
        setUsers(convertUnknownToStringArray(myObject?.users));
        //fetchData(pageSize, current, keyword, users);
      } else {
        setUsers([]);
        //fetchData(pageSize, current, keyword, []);
      }
      
      closeFilter(); // Close modal after successful submission
      
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
        const response = await apiClient.get('/events?pageSize='+pageSize+'&pageNumber='+pageNumber+'&keyword='+keyword+'&'+userString); // Replace with your actual API endpoin
        const temp = response.data?.data.map((item: Events, index: number) => {
          return {
            key:  item._id,
            id: item._id,
            count: ((pageNumber -1) * pageSize) + index + 1,
            customer: item.customer,
            event_type: item.event_type,
            user: item.user,
            processed: item.processed,
            from_date: moment(item.from_date).tz("Asia/Bangkok").format('DD/MM/YYYY HH:mm:ss'),
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
  const handleCloseModal = () => setOpen(false);
  const handleFormSubmit = (formData: unknown) => {
    console.log('Form data submitted:', formData);
    // Perform actions with formData, e.g., API call
    handleCloseModal(); // Close modal after successful submission
    fetchData(pageSize, current, keyword, users);
  };
  useEffect(() => {
    fetchData(10,1, '', users);
  }, [keyword,users]);
  return (
    <section>
      <h2 className="title">{"Danh sách công việc"}</h2>
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
            Thêm công việc
          </Button>
        </div>
      </div>
      <Table<DataType> columns={columns} dataSource={data} onChange={onChange}  pagination={{
        pageSize: pageSize,
        showSizeChanger: true,
        total: total,
        pageSizeOptions: ['10', '20', '50'],
      }}/>
      <Drawer
      
          title="Thêm công việc"
          width={900}
          closable={true}
          onClose={onClose}
          open={open}
        >
          <CreateEvent id={id} onCancel={handleCloseModal} onSubmitSuccess={handleFormSubmit}/>
      </Drawer>
      <Drawer
          title="Lọc công việc"
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
        <p>Bạn chắc chắn muốn xóa công việc này!</p>
      </Modal>
    </section>
    
  );
}

export default Works;