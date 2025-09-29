import Profile from "./profile/Profile";

import classes from "./TopNavRightBox.module.scss";

function TopNavRightBox() {
  return (
    <div className={classes.topNavBox_right}>
      <div className={classes.wrapper}>
      </div>
      <div className="notification-container">
        <i className="icon-globe"></i>
        <span className="notification-counter"></span>
      </div>
      <Profile />
    </div>
  );
}

export default TopNavRightBox;
