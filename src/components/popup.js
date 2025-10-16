import "./popup.css";

export default function Popup({ About, setPopupVisible }) {
    return (
        <div className="popup">
            <button onClick={() => setPopupVisible(false)}>
                X
            </button>
            <h3>About</h3>
            < About />
        </div>
    );
}