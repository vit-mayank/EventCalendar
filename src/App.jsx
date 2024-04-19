import React, { useState,useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

const App = () => {
	const [selectedDate, setSelectedDate] = useState(null);
	const [eventName, setEventName] = useState("");
	const [events, setEvents] = useState([]);
  const [updating, setUpdating] = useState(false)
  useEffect(()=>{
    let fetchedEvents = JSON.parse(localStorage.getItem("events"))
    if(fetchedEvents && fetchedEvents.length>0) {
      fetchedEvents?.map((evt)=>{evt.date = new Date(Date.parse(evt.date))})
      setEvents(fetchedEvents)
    }
  },[])
  useEffect(() => {
    localStorage.setItem("events",JSON.stringify(events))

  }, [events])
  


	const Date_Click_Fun = (date) => {
		setSelectedDate(date);
	};

	const Event_Data_Update = (event) => {
		setEventName(event.target.value);
	};

	const Create_Event_Fun = () => {
		if (selectedDate && eventName) {
			const newEvent = {
				id: new Date().getTime(),
				date: selectedDate,
				title: eventName,
			};
			setEvents([...events, newEvent]);
			setSelectedDate(null);
			setEventName("");
			setSelectedDate(newEvent.date);
      setUpdating(false)
		}
	};
	const Update_Event_Fun = (eventId) => {
    setUpdating(true)
    const presentEventName =events.filter((event)=> {if(event.id == eventId) return event})[0].title
    setEventName(presentEventName)
    Delete_Event_Fun(eventId)
	};

	const Delete_Event_Fun = (eventId) => {
		const updated_Events = events.filter((event) => event.id !== eventId);
		setEvents(updated_Events);
	};

	return (
		<div className="app">
			<h1>My Events</h1>
			<div className="container">
				<div className="calendar-container">
					<Calendar
						value={selectedDate}
						onClickDay={Date_Click_Fun}
						tileClassName={({ date }) =>
							selectedDate &&
							date.toDateString() === selectedDate.toDateString()
								? "selected"
								: events.some(
									(event) =>
										event.date.toDateString() ===
										date.toDateString(),
								)
								? "event-marked"
								: ""
              
              }
					/>{" "}
				</div>
				<div className="event-container">
					{" "}
					{selectedDate && (
						<div className="event-form">
							<h2> Create Event </h2>{" "}
							<p>
								{" "}
								Selected Date: {selectedDate.toDateString()}{" "}
							</p>{" "}
							<input
								type="text"
								placeholder="Event Name"
								value={eventName}
								onChange={Event_Data_Update}
							/>{" "}
							<button
								className="create-btn"
								onClick={Create_Event_Fun}
							>
								Click Here to {updating?"Edit":"Add"} Event{" "}
							</button>{" "}
						</div>
					)}
					{events.length > 0 && selectedDate && (
						<div className="event-list">
							<h2> My Created Event List </h2>{" "}
							<div className="event-cards">
								{" "}
								{events.map((event) =>
									event.date.toDateString() ===
									selectedDate.toDateString() ? (
										<div
											key={event.id}
											className="event-card"
										>
											<div className="event-card-header">
												<span className="event-date">
													{" "}
													{event.date.toDateString()}{" "}
												</span>{" "}
												<div className="event-actions">
													<button
														className="update-btn"
														onClick={() =>
															Update_Event_Fun(
																event.id
															)
														}
													>
														Update Event{" "}
													</button>{" "}
													<button
														className="delete-btn"
														onClick={() =>
															Delete_Event_Fun(
																event.id,
															)
														}
													>
														Delete Event{" "}
													</button>{" "}
												</div>{" "}
											</div>{" "}
											<div className="event-card-body">
												<p className="event-title">
													{" "}
													{event.title}{" "}
												</p>{" "}
											</div>{" "}
										</div>
									) : null,
								)}{" "}
							</div>{" "}
						</div>
					)}{" "}
				</div>{" "}
			</div>{" "}
		</div>
	);
};

export default App;
