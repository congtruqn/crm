import { Icon } from "@iconify/react";
import Profile from "./profile/Profile";

import classes from "./TopNavRightBox.module.scss";
import { useNotiStore } from "../../../store/notiStore";
import { Link } from "react-router-dom";

function TopNavRightBox() {
  const value = useNotiStore((state ) => state.value);
  return (
    <div className={classes.topNavBox_right}>
      <div className={classes.wrapper}>
      <div className={classes.lang}>
        <div className="notification-container">
        <Link to={"/crm/notifications"}><Icon icon="iconamoon:notification-thin" width="25" /></Link>
          <span className="notification-counter">{value}</span>
        </div>
      </div>
      <Profile />
      </div>
    </div>
  );
}

export default TopNavRightBox;
