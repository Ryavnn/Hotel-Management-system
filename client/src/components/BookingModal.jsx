const BookingSuccessModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Booking Successful!</h2>
        <p>Your booking has been confirmed. We look forward to hosting you.</p>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
