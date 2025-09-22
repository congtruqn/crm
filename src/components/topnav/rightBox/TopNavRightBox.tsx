import Profile from "./profile/Profile";

import classes from "./TopNavRightBox.module.scss";

function TopNavRightBox() {
  return (
    <div className={classes.topNavBox_right}>
      <div className={classes.wrapper}>
      </div>
      <Profile />
    </div>
  );
}

export default TopNavRightBox;
