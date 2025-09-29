import React, {useEffect, useState} from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import { Modal, Input } from 'antd';
import moment from 'moment-timezone';
import apiClient from "../api/apiClient";
import type { Events } from "../interfaces/event";


const Appointment: React.FC = ()=>{  
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();
  const [startDate, setStartDate] = useState<DayPilot.Date>(DayPilot.Date.today());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const startOfWeek = moment().startOf('isoWeek');
  const endOfWeek = moment().endOf('isoWeek');
  const startOfWeekISO = startOfWeek.toISOString();
  const endOfWeekISO = endOfWeek.toISOString();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (!calendar || calendar?.disposed()) {
      return;
    }
    calendar.events.add({
      id: 1,
      text: "",
      start: from,
      end: to,
      tags: {
          participants: 2,
      },
      html: inputValue
  });
    // Perform actions when OK is clicked
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

  };
  const handleCancel = () => {
    setIsModalOpen(false);
    // Perform actions when Cancel is clicked or modal is closed
  };
  const previous = () => {
    setStartDate(startDate.addDays(-7));
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
      cellHeight: 25,
      businessBeginsHour: 8,
      businessEndsHour: 18,
      onTimeRangeSelected: async (args) => {
        //console.log(_args);
          const scheduler = args.control;
          //const modal = DayPilot.Modal.showUrl(<MyModal />);
          scheduler.clearSelection(); // Clear the selection after user interaction

          // console.log(args);
          // if (modal.canceled) {
          //     return;
          // }
          showModal();
          setFrom(args.start?.toString())
          setTo(args.end?.toString())
          // scheduler.events.add({
          //     start: args.start,
          //     end: args.end,
          //     id: DayPilot.guid(), // Generate a unique ID for the event
          //     resource: args.resource, // If using resources
          //     text: "inputValue"
          // });
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
            html: `Khách hàng: ${item.customer} </br> ${item.event_type}`
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
    fetchData(calendar, startOfWeekISO,endOfWeekISO)
}, [calendar]);
  return (
    <section>
      <h2 className="title">{"Danh sách sản phẩm"}</h2>
      <button onClick={previous}>Previous</button>
      <DayPilotCalendar
          {...config}
          startDate={startDate}
          controlRef={setCalendar}
          onEventClick={onEventClick}
      />
       <Modal
              title="Basic Modal"
              open={isModalOpen} 
              onOk={handleOk} 
              onCancel={handleCancel}
            >
        <p>Some content in the modal...</p>
        <Input value={inputValue} onChange={handleChange} />
      </Modal>
    </section>
  );
}

export default Appointment;