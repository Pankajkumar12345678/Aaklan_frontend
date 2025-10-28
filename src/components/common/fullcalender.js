// import React, { Component } from 'react';
// import FullCalendar from 'fullcalendar-reactwrapper';
// import "fullcalendar-reactwrapper/dist/css/fullcalendar.min.css"
// // import '../../assets/plugins/fullcalendar/fullcalendar.min.css';

// const eventsd = [
//     {
//         title: 'Birthday Party',
//         start: '2020-08-01',
//         className: 'bg-info'
//     }, {
//         title: 'Conference',
//         start: '2020-08-05',
//         end: '2018-08-08',
//         className: 'bg-warning'
//     }, {
//         title: 'Meeting',
//         start: '2020-08-09T12:30:00',
//         allDay: true, // will make the time show
//         className: 'bg-success',
//     }
// ]
// const headerdata = {
//     left: 'title',
//     center: '',
//     // right: 'month, agendaWeek, agendaDay, prev, next'
//     right: ''
// }
// class Fullcalender extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             events: "",
//         }
//     }
//     render() {
//         return (
//             <div id="calender">
//                 <FullCalendar
//                     id="calendar"
//                     header={headerdata}
//                     defaultDate={new Date()}
//                     navLinks={true}
//                     editable={true}
//                     // droppable={true}
//                     eventLimit={true} // allow "more" link when too many events
//                     // selectable={true}
//                     events={eventsd}
//                 />
//             </div>
//         );
//     }
// }

// export default Fullcalender;

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // needed for month view
// import '@fullcalendar/common/main.css';
// import '@fullcalendar/daygrid/main.css';

const FullCalendarComponent = () => {
  const [events] = useState([
    {
      title: 'Birthday Party',
      date: '2024-08-01',
      className: 'bg-info'
    },
    {
      title: 'Conference',
      start: '2024-08-05',
      end: '2024-08-08',
      className: 'bg-warning'
    },
    {
      title: 'Meeting',
      date: '2024-08-09',
      className: 'bg-success'
    }
  ]);

  return (
    <div id="calendar">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
        editable={true}
        selectable={true}
      />
    </div>
  );
};

export default FullCalendarComponent;