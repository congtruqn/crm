import { Icon } from "@iconify/react";
import Profile from "./profile/Profile";

import classes from "./TopNavRightBox.module.scss";
import { useNotiStore } from "../../../store/notiStore";
import { Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";

function TopNavRightBox() {
  const value = useNotiStore((state ) => state.value);
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
      <Profile />
      </div>
    </div>
  );
}

export default TopNavRightBox;
