const sidebarNav = [
    {
      link: "/crm/",
      section: "dashboard",
      icon: "lucide:layout-dashboard", //width:"20"
      text: "Dashboard",
      userTypes: [2],
    },
    {
      link: "/crm/event-types",
      section: "Loại công việc",
      icon: "icon-park-outline:ad-product",
      text: "Products",
      userTypes: [2],
    },
    {
      link: "/crm/customers",
      section: "Khách hàng",
      icon: "ph:users-bold",
      text: "Customers",
      userTypes: [2,3,4,5,6],
    },
    {
      link: "/crm/works",
      section: "Công việc",
      icon: "cib:when-i-work",
      text: "Customers",
      userTypes: [2,3,4,5,6],
    },    
    {
      link: "/crm/quote",
      section: "Báo giá",
      icon: "icon-park-outline:transaction-order",
      text: "Orders",
      userTypes: [2,3,4,5,6],
    },
    {
      link: "/crm/appointment",
      section: "Lịch",
      icon: "ic:round-inventory",
      text: "Analytics",
      userTypes: [2,3,4,5,6],
    },
  ];
  
  export default sidebarNav;