import React, {useEffect, useState} from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import { Modal, Input } from 'antd';


const Appointment: React.FC = ()=>{  
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();
  const [startDate, setStartDate] = useState<DayPilot.Date>(DayPilot.Date.today());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
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
      text: "Event 1",
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
    setIsModalOpen(true)
  };
  const initialConfig: DayPilot.CalendarConfig = {
      viewType: "Week",
      startDate: "2026-10-01",
      locale: "en-us",
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
  useEffect(() => {

    if (!calendar || calendar?.disposed()) {
        return;
    }
    const events: DayPilot.EventData[] = [
        {
            id: 1,
            text: "Event 1",
            start: "2025-09-24T08:30:00",
            end: "2025-09-24T13:00:00",
            tags: {
                participants: 2,
            },
            html: "Khách hàng</br>Gửi báo giá"
        },
        
        // ...
        
    ];

    calendar.update({events});
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