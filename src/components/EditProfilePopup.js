import React, { useState, useContext, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
    const currentUser = useContext(CurrentUserContext);
    const [inputs, setInputs] = useState({ name: '', about: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [buttonText, setButtonText] = useState('Guardar');
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setInputs({ name: currentUser.name || '', about: currentUser.about || '' });
        }
    }, [currentUser, isOpen]);

    useEffect(() => {
        validate(inputs);
    }, [inputs]);

    const validate = (inputs) => {
        const newErrors = {};
        if (!inputs.name) {
            newErrors.name = 'El nombre es obligatorio.';
        } else if (inputs.name.length < 2) {
            newErrors.name = 'El nombre debe tener al menos 2 caracteres.';
        }

        if (!inputs.about) {
            newErrors.about = 'La descripción es obligatoria.';
        } else if (inputs.about.length < 2) {
            newErrors.about = 'La descripción debe tener al menos 2 caracteres.';
        }

        setErrors(newErrors);
        setIsSubmitDisabled(Object.keys(newErrors).length > 0);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
        setShowErrors(true);
    };

    const handleClickClose = () => {
        onClose();
        setInputs({ name: '', about: '' });
        setIsSubmitDisabled(true);
        setShowErrors(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setButtonText('Guardando...');
        if (!isSubmitDisabled) {
            onUpdateUser(inputs)
                .then(() => {
                    setButtonText('Guardar');
                    setInputs({ name: '', about: '' })
                    onClose();
                })
                .catch(() => {
                    setButtonText('Error');
                })
                .finally(() => {
                    setIsSubmitDisabled(true);
                    setShowErrors(false);
                });

        }
    }


    return (
        <PopupWithForm
            name="profileForm"
            title="Editar perfil"
            isOpen={isOpen}
            onClose={handleClickClose}
            onSubmit={handleSubmit}
            submitButtonText={buttonText}
            isSubmitDisabled={isSubmitDisabled}
        >
            <input
                type="text"
                name="name"
                className="form__input"
                placeholder="Nombre"
                minLength="2"
                maxLength="30"
                required
                value={inputs.name}
                onChange={handleChange}
            />
            <span className={`empty-field ${showErrors ? "empty-field_error" : ""}`}>{errors.name}</span>

            <input
                type="text"
                name="about"
                className="form__input"
                placeholder="Acerca de"
                required
                value={inputs.about}
                onChange={handleChange}
            />
            <span className={`empty-field ${showErrors ? "empty-field_error" : ""}`}>{errors.about}</span>

        </PopupWithForm>
    );
}

export default EditProfilePopup;
