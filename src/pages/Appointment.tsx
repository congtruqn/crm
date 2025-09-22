import React, {useEffect, useState} from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";



const Appointment: React.FC = ()=>{  
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();
  const [startDate, setStartDate] = useState<DayPilot.Date>(DayPilot.Date.today());
  const previous = () => {
    setStartDate(startDate.addDays(-7));
  };
  const initialConfig: DayPilot.CalendarConfig = {
      viewType: "Week",
      startDate: "2026-10-01",
      locale: "en-us"
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
            start: "2026-10-02T10:30:00",
            end: "2026-10-02T13:00:00",
            tags: {
                participants: 2,
            }
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
            />
    </section>
  );
}

export default Appointment;