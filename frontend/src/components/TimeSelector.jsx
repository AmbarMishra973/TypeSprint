function TimeSelector({ selectedTime, setSelectedTime }) {
  const times = [30, 60, 120];

  return (
    <div className="time-selector">
      {times.map((time) => (
        <button
          key={time}
          className={selectedTime === time ? "active-time" : ""}
          onClick={() => setSelectedTime(time)}
        >
          {time}s
        </button>
      ))}
    </div>
  );
}

export default TimeSelector;