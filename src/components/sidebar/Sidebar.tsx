import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { Tooltip } from "antd";
import sidebarNav from "../../config/sidebarNav";
import SidebarContext from "../../store/sidebarContext";
import { Icon } from "@iconify/react";
import classes from "./Sidebar.module.scss";
import { useMyStore } from "../../store/userStore";
import type { User } from "../../interfaces/user";

function Sidebar() {
  const value:User = useMyStore((state ) => state.value);
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowSize();
  const location = useLocation();
  const sidebarCtx = useContext(SidebarContext);;

  function openSidebarHandler() {
    //for width>768(tablet size) if sidebar was open in width<768 was opened too.
    //just in case of tablet size and smaller then, sidebar__open can added.
    if (width <= 768) document.body.classList.toggle("sidebar__open");
  }

  function logoutHandler() {
    openSidebarHandler();
    //loginCtx.toggleLogin();
  }

  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];
    const activeItem = sidebarNav.findIndex((item) => item.section === curPath);

    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

  return (
    <div
      className={`${classes.sidebar} ${
        !sidebarCtx.isOpen && classes.sidebar_close
      }`}
    >
      <div className="sidebar__logo">
        <img src={import.meta.env.VITE_BASE_URL+'/static/'+value.website_logo} alt="digikala" />
      </div>
      <div className={classes.sidebar__menu}>
        {sidebarNav.map((nav, index) => {
          if (!nav.userTypes.includes(value.type)) return null;
          const link = (
            <Link
              to={nav.link}
              className={`${classes.sidebar__menu__item} ${
                activeIndex === index && classes.active
              }`}
              onClick={openSidebarHandler}
            >
              <div className={classes.sidebar__menu__item__icon}>
                <Icon icon={nav.icon} />
              </div>
              <div className={classes.sidebar__menu__item__txt}>
                {nav.section}
              </div>
            </Link>
          );
          // Khi sidebar đóng, hover hiện menu bên phải (dạng ul/li) qua Tooltip portal
          return sidebarCtx.isOpen ? (
            <span key={`nav-${index}`}>{link}</span>
          ) : (
            <Tooltip
              key={`nav-${index}`}
              placement="right"
              classNames={{ root: classes.sidebar__flyout }}
              title={
                <ul className={classes.sidebar__flyout__list}>
                  <li>{nav.section}</li>
                </ul>
              }
            >
              {link}
            </Tooltip>
          );
        })}
      </div>

      <div className={[classes.sidebar__menu, classes.logout].join("")}>
        <Link
          to="/user/logout"
          target="_seft"
          className={classes.sidebar__menu__item}
          onClick={logoutHandler}
        >
          <div className={classes.sidebar__menu__item__icon}>
            <Icon icon="tabler:logout" />
          </div>
          <div className={classes.sidebar__menu__item__txt}>{"logout"}</div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;