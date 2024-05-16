import React, { useState, useEffect, useCallback } from "react";
import closeIcon from '../images/Icons/close-icon.png';

function ImagePopup({ card, onClose }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(!!card && !!card.link);
    }, [card]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setTimeout(onClose, 300);
    }, [onClose]);

    useEffect(() => {
        const handleEscClose = (event) => {
            if (event.key === "Escape" && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscClose);
        }

        return () => {
            document.removeEventListener("keydown", handleEscClose);
        };
    }, [isOpen, handleClose]);


    if (!isOpen) {
        return null;
    }

    const imageSrc = card?.link || 'placeholder-image-url.jpg';
    const imageAlt = card?.name || 'Image';

    return (
        <div className="imgPopup imgPopup_open" onClick={handleClose}>
            <div className="imgPopup__content" onClick={(e) => e.stopPropagation()}>
                <img src={imageSrc} alt={imageAlt} className="imgPopup__photo" />
                <h2 className="imgPopup__title">{imageAlt}</h2>
                <button className="imgPopup__close" type="button" onClick={handleClose}>
                    <img src={closeIcon} alt="Close" className="imgPopup__close-icon" />
                </button>
            </div>
        </div>
    );
};

export default ImagePopup;
