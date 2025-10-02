import { Icon } from "@iconify/react";
import Profile from "./profile/Profile";

import classes from "./TopNavRightBox.module.scss";
import { useNotiStore } from "../../../store/notiStore";

function TopNavRightBox() {
  const value = useNotiStore((state ) => state.value);
  return (
    <div className={classes.topNavBox_right}>
      <div className={classes.wrapper}>
      <div className={classes.lang}>
        <div className="notification-container">
        <Icon icon="iconamoon:notification-thin" width="25" />
          <span className="notification-counter">{value}</span>
        </div>
      </div>
      <Profile />
      </div>
    </div>
  );
}

export default TopNavRightBox;
