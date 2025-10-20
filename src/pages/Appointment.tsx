import React, {useEffect, useState} from "react";
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
  const [startDate, setStartDate] = useState<DayPilot.Date>(DayPilot.Date.today());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const startOfWeek = moment().startOf('isoWeek');
  const endOfWeek = moment().endOf('isoWeek');
  const startOfWeekISO = startOfWeek.toISOString();
  const endOfWeekISO = endOfWeek.toISOString();
  const [fromDate, setFromDate] = useState(startOfWeekISO);
  const [toDate, setToDate] = useState(endOfWeekISO);
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
    setStartDate(startDate.addDays(-7));
    setFromDate(startDate.addDays(-7).toString())
    setToDate(startDate.toString())
  };
  const next = () => {
    setStartDate(startDate.addDays(+7));
    setFromDate(startDate.addDays(+7).toString())
    setToDate(startDate.addDays(14).toString())
  };


  const onEventClick = (e: unknown) => {
    console.log(e);
    //setIsModalOpen(true)
  };
  const initialConfig: DayPilot.CalendarConfig = {
      viewType: "Week",
      startDate: "2026-10-01",
      locale: "vi-vn",
      timeRangeSelectedHandling: "Enabled",
      cellHeight: 35,
      headerHeight: 40,
      height: 600,
      businessBeginsHour: 8,
      businessEndsHour: 18,
      
      onTimeRangeSelected: async (args) => {
          const scheduler = args.control;
          scheduler.clearSelection(); // Clear the selection after user interaction
          showModal();
          setFrom(args.start?.toString())
          setTo(args.end?.toString())
      },
  };
  const [config, setConfig ] = useState(initialConfig);
  console.log(setConfig);

  const fetchData = async (calendar: DayPilot.Calendar | undefined, fromDate: string, toDate: string) => {
    try {
        const response = await apiClient.get('/get-event-by-date?fromDate='+fromDate+'&toDate='+toDate); // Replace with your actual API endpoin
        //console.log(response.data?.data);
        const events:DayPilot.EventData[] = response.data?.data.map((item: Events) => {
          return {
            id: item._id,
            text: "Event 1",
            start: moment(item.from_date).tz("Asia/Bangkok").add(7,'hours').format(),
            end: moment(item.to_date).tz("Asia/Bangkok").add(7,'hours').format(),
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
  };

  useEffect(() => {
    fetchData(calendar, fromDate, toDate)
}, [calendar, fromDate]);
  return (
    <section>
      <h2 className="title">{"Lịch"}</h2>
      <div className="calenda_panel">
      <button className="daypilot_button" onClick={previous}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 17.308L8.692 12L14 6.692l.708.708l-4.6 4.6l4.6 4.6z"/></svg></button>
      <button className="daypilot_button" onClick={next}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m13.292 12l-4.6-4.6l.708-.708L14.708 12L9.4 17.308l-.708-.708z"/></svg></button>
      </div>
      <div className="container_p">
        <DayPilotCalendar
            {...config}
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