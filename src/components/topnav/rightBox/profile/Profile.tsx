import avt  from "../../../../assets/images/avatar.jpg";
import classes from "./Profile.module.scss";
import { useMyStore } from '../../../../store/userStore';
import type { User } from "../../../../interfaces/user";
function Profile() {
  const value:User = useMyStore((state ) => state.value);
  return (
    <div className={classes.profile}>
      <div className={classes.profile__avatar}>
        <img src={avt} alt="avatar" />
      </div>
      <div className={classes.profile__info}>
        <p className={classes.profile__userName}>{value.name || ''}</p>
        {/* <span className={classes.profile__role}>{t("admin")}</span> */}
      </div>
    </div>
  );
}

export default Profile;
