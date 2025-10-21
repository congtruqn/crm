import { Icon } from "@iconify/react";
import Profile from "./profile/Profile";

import classes from "./TopNavRightBox.module.scss";
import { useNotiStore } from "../../../store/notiStore";
import { Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import { Dropdown, Space, type MenuProps } from "antd";
import { useMyStore } from "../../../store/userStore";
import type { User } from "../../../interfaces/user";
const items: MenuProps['items'] = [
  {
    label: (
      <a href="/crm/customer-status"  rel="noopener noreferrer">
        Trạng thái khách hàng
      </a>
    ),
    key: '0',
  },
  {
    label: (
      <a href="/crm/customer-evaluations" rel="noopener noreferrer">
        Đánh giá khách hàng
      </a>
    ),
    key: '1',
  },
  {
    label: (
      <a href="/crm/event-types" rel="noopener noreferrer">
        Loại công việc
      </a>
    ),
    key: '2',
  },
];
function TopNavRightBox() {
  const value = useNotiStore((state ) => state.value);
  const user:User = useMyStore((state ) => state.value);
  const { setValue } = useNotiStore();
  const updateNoti = async () => {
    try {
        await apiClient.put('notifications', {});
        setValue(0);
    } catch (err) {
      console.error('Fetch error: ', err);
    } finally { /* empty */ }
  };
  return (
    <div className={classes.topNavBox_right}>
      <div className={classes.wrapper}>
      <div className={classes.lang}>
        <div className="notification-container">
        <Link to={"/crm/notifications"} onClick={updateNoti}><Icon icon="iconamoon:notification-thin" width="25" /><span className="notification-counter">{value}</span></Link>
        </div>
      </div>
      {user.type == 2 &&
        <div className={classes.lang}>
          <div className="notification-container">
          <Dropdown menu={{ items }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="#111111" d="m23.265 24.381l.9-.894c4.164.136 4.228-.01 4.411-.438l1.144-2.785l.085-.264l-.093-.231c-.049-.122-.2-.486-2.8-2.965V15.5c3-2.89 2.936-3.038 2.765-3.461l-1.139-2.814c-.171-.422-.236-.587-4.37-.474l-.9-.93a20 20 0 0 0-.141-4.106l-.116-.263l-2.974-1.3c-.438-.2-.592-.272-3.4 2.786l-1.262-.019c-2.891-3.086-3.028-3.03-3.461-2.855L9.149 3.182c-.433.175-.586.237-.418 4.437l-.893.89c-4.162-.136-4.226.012-4.407.438l-1.146 2.786l-.09.267l.094.232c.049.12.194.48 2.8 2.962v1.3c-3 2.89-2.935 3.038-2.763 3.462l1.138 2.817c.174.431.236.584 4.369.476l.9.935a20.2 20.2 0 0 0 .137 4.1l.116.265l2.993 1.308c.435.182.586.247 3.386-2.8l1.262.016c2.895 3.09 3.043 3.03 3.466 2.859l2.759-1.115c.436-.173.588-.234.413-4.436m-11.858-6.524a4.957 4.957 0 1 1 6.488 2.824a5.014 5.014 0 0 1-6.488-2.824"/></svg>
              </Space>
            </a>
          </Dropdown>
          </div>
        </div>
      }
      <Profile />
      </div>
    </div>
  );
}

export default TopNavRightBox;
