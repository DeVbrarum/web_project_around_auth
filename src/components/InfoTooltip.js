
import React, { useEffect } from 'react';
import closeIcon from '../images/Icons/close-icon.png';
import accessIcon from '../images/Icons/pass.png';
import failIcon from '../images/Icons/fail.png';


function InfoTooltip({ isOpen, onClose, message, isError }) {
    useEffect(() => {
        const handleEscClose = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscClose);
        };

        return () => {
            document.removeEventListener('keydown', handleEscClose);
        };
    }, [isOpen, onClose]);

    const icon = isError ? failIcon : accessIcon;
    const iconAlt = isError ? "Error" : "Success";

    return (
        <div className={`popup ${isOpen ? 'popup_opened' : ''}`}
            onClick={onClose}
        >
            <div className="popup__container">
                <img
                    src={closeIcon}
                    alt="close icon"
                    className="popup__close"
                    onClick={onClose}
                />
                <img
                    src={icon}
                    alt={iconAlt}
                    className="popup__icon"
                />
                <p className="popup__message">{message}</p>
            </div>
        </div>
    );
}

export default InfoTooltip;
