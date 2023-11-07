const Notification = ({ message, error }) => {
  return (
    <>
      {!error && <div className="notification">{message}</div>}
      {error && <div className="error">{message}</div>}
    </>
  )
}

export default Notification
