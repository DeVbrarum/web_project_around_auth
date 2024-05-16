import React, { useEffect, useState } from "react"
import closeIcon from '../images/Icons/close-icon.png';

function ConfirmPopup({ isOpen, onClose, onConfirm }) {
    const [buttonText, setButtonText] = useState('Si');

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

    const handleConfirm = (e) => {
        e.preventDefault();
        setButtonText('Guardando...');
        onConfirm()
            .then(() => {
                setButtonText('Si');
            })
            .catch(() => {
                setButtonText('Error');
            });
    }


    return (
        <div id="deletePopup" className={`deletePopup ${isOpen ? 'deletePopup_open' : ''}`}>
            <form className="deletePopup__content">
                <button className="deletePopup__close" onClick={onClose} type="button">
                    <img
                        src={closeIcon}
                        alt="close icon"
                        className="deletePopup__close-icon"
                    />
                </button>
                <h2 className="deletePopup__title">¿Estás seguro?</h2>
                <button
                    id="deletePopupButton"
                    className="deletePopup__button"
                    onClick={handleConfirm}
                    type="button"
                >{buttonText}</button>
            </form>
            <div className="deletePopup__background" onClick={onClose}></div>
        </div>
    );
}

export default ConfirmPopup;
