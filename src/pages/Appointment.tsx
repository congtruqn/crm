import React, {useEffect, useState, useCallback} from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import { Drawer } from 'antd';
import moment from 'moment-timezone';
import apiClient from "../api/apiClient";
import type { Events } from "../interfaces/event";
import CreateEvent from "../components/event/createEvent";
import { useDateStore } from "../store/dateStore";


const Appointment: React.FC = ()=>{ 
  const { setFrom, setTo } = useDateStore();
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  // DayPilot đọc chuỗi ngày giờ theo đúng ký tự (bỏ qua Z/offset), nên phải truyền
  // giờ địa phương (Asia/Bangkok) không có hậu tố UTC, giống cách format cho events bên dưới.
  const toLocalWallClock = useCallback((m: moment.Moment) => m.tz("Asia/Bangkok").format("YYYY-MM-DDTHH:mm:ss"), []);
  const startOfWeek = moment().startOf('isoWeek');
  const endOfWeek = moment().endOf('isoWeek');
  const startOfWeekLocal = toLocalWallClock(startOfWeek);
  const endOfWeekLocal = toLocalWallClock(endOfWeek);
  const [fromDate, setFromDate] = useState(startOfWeekLocal);
  const [toDate, setToDate] = useState(endOfWeekLocal);
  const [startDate, setStartDate] = useState(startOfWeekLocal);
  let currentHour = moment().tz("Asia/Bangkok").hour();
  if(currentHour > 15){
    currentHour = 15
  }
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setFrom('')
    setTo('')
    fetchData(calendar, fromDate, toDate)
    setIsModalOpen(false);
    if (!calendar || calendar?.disposed()) {
      return;
    }
  };
  const handleCancel = () => {
    setFrom('')
    setTo('')
    setIsModalOpen(false);
  };
  const previous = () => {
    // startDate là chuỗi giờ địa phương (không có Z) nên moment() parse đúng giờ wall-clock,
    // chỉ format lại cùng kiểu naive-local, không dùng toISOString() (sẽ lại bị lệch múi giờ).
    setStartDate(toLocalWallClock(moment(startDate).subtract(7,'days')));
    setFromDate(toLocalWallClock(moment(startDate).subtract(7,'days')))
    setToDate(startDate)
  };
  const next = () => {
    setStartDate(toLocalWallClock(moment(startDate).add(7,'days')));
    setFromDate(toLocalWallClock(moment(startDate).add(7,'days')))
    setToDate(toLocalWallClock(moment(startDate).add(14,'days')))
  };


  const onEventClick = (e: unknown) => {
    console.log(e);
    //setIsModalOpen(true)
  };
  const initialConfig: DayPilot.CalendarConfig = {
      viewType: "Week",
      startDate: startDate,
      locale: "vi-vn",
      timeRangeSelectedHandling: "Enabled",
      cellHeight: 35,
      headerHeight: 40,
      height: 800,
      businessBeginsHour: currentHour - 1,
      businessEndsHour: 24,
      onTimeRangeSelected: async (args) => {
          const scheduler = args.control;
          scheduler.clearSelection(); // Clear the selection after user interaction
          showModal();
          setFrom(args.start?.toString())
          setTo(args.end?.toString())
      },
  };


  const fetchData = useCallback(async (calendar: DayPilot.Calendar | undefined, fromDate: string, toDate: string) => {
    try {
        const response = await apiClient.get('/get-event-by-date?fromDate='+fromDate+'&toDate='+toDate); // Replace with your actual API endpoin
        //console.log(response.data?.data);
        const events:DayPilot.EventData[] = response.data?.data.map((item: Events) => {
          return {
            id: item._id,
            text: "Event 1",
            start: toLocalWallClock(moment(item.from_date)),
            end: toLocalWallClock(moment(item.to_date)),
            html: `Khách hàng: ${item.customer} <br> ${item.event_type}`
          }
        })
        if (!calendar || calendar?.disposed()) {
          return;
        }
        calendar.update({events});
    } catch (err) {
      console.log(err);
    }
  }, [toLocalWallClock]);

  console.log(currentHour)
  useEffect(() => {
    fetchData(calendar, fromDate, toDate)
}, [calendar, fromDate, toDate, fetchData]);
  return (
    <section>
      <h2 className="title">{"Lịch"}</h2>
      <div className="calenda_panel">
      <button className="daypilot_button" onClick={previous}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 17.308L8.692 12L14 6.692l.708.708l-4.6 4.6l4.6 4.6z"/></svg></button>
      <button className="daypilot_button" onClick={next}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m13.292 12l-4.6-4.6l.708-.708L14.708 12L9.4 17.308l-.708-.708z"/></svg></button>
      </div>
      <div className="container_p">
        <DayPilotCalendar
            {...initialConfig}
            startDate={startDate}
            controlRef={setCalendar}
            onEventClick={onEventClick}
            onBeforeCellRender={(args) => {
              const now = DayPilot.Date.now();
              if (args.cell.start <= now && now < args.cell.end) {
                args.cell.properties.cssClass = "current_time";
              }
            }}
        />
      </div>
      
      <Drawer
          title="Thêm công việc"
          width={900}
          closable={true}
          onClose={handleCancel}
          open={isModalOpen}
        >
          <CreateEvent id={''} onCancel={handleCancel} onSubmitSuccess={handleOk}/>
      </Drawer>
    </section>
  );
}

export default Appointment;