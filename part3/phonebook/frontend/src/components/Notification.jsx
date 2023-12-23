import "../index.css";

const Notification = ({ config }) => {
  return <div className={`msg ${config.status}`}>{config.text}</div>;
};

export default Notification;
