import React, { useContext, useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
    const currentUser = useContext(CurrentUserContext);
    const [avatarUrl, setAvatarUrl] = useState('')
    const [buttonText, setButtonText] = useState('Guardar');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [errors, setErrors] = useState('');
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAvatarUrl(currentUser.avatar || '');
            setIsSubmitDisabled(false);
            setErrors('');
            setShowErrors(false);
        }
    }, [currentUser, isOpen]);

    const validate = (url) => {
        if (!url) {
            setErrors('La URL del avatar es obligatoria.');
            setIsSubmitDisabled(true);
            setShowErrors(true);
            return false;
        } else if (!/^https:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp)/.test(url)) {
            setErrors('La URL debe ser una dirección de imagen válida.');
            setIsSubmitDisabled(true);
            setShowErrors(true);
            return false;
        }
        setErrors('');
        setIsSubmitDisabled(false);
        setShowErrors(false);
        return true;
    };

    const handleChange = (e) => {
        const newAvatarUrl = e.target.value;
        setAvatarUrl(newAvatarUrl);
        validate(newAvatarUrl);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate(avatarUrl)) {
            setButtonText('Guardando...');
            onUpdateAvatar({ avatar: avatarUrl })
                .then(() => {
                    onClose();
                })
                .catch(() => {
                    setButtonText('Error');
                })
                .finally(() => {
                    setButtonText('Guardar');
                });
        }
    };


    const handleClickClose = () => {
        onClose();
        setIsSubmitDisabled(false);
        setShowErrors(false);
    }


    return (
        <PopupWithForm
            name="avatarPopup"
            title="Cambia foto de perfil"
            isOpen={isOpen}
            onClose={handleClickClose}
            onSubmit={handleSubmit}
            submitButtonText={buttonText}
            isSubmitDisabled={isSubmitDisabled}
        >
            <input
                type="url"
                name="urlAvatar"
                className="form__input avatarPopup__input"
                placeholder="https://somewebsite.com/someimage.jpg"
                value={avatarUrl}
                pattern="https://.*"
                onChange={handleChange}
                onClick={(e) => e.target.select()}
                required
            />
            <span className={`empty-field ${showErrors ? "empty-field_error" : ""}`}>{errors}</span>

        </PopupWithForm>
    );
}

export default EditAvatarPopup;
