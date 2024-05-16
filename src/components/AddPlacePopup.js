import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace, onSubmit }) {
  const [inputs, setInputs] = useState({ title: '', urlImagen: '' });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [buttonText, setButtonText] = useState('Crear');
  const [showErrors, setShowErrors] = useState(false);

  const handleAddPlaceSubmit = (e) => {
    e.preventDefault();
    setButtonText('Guardando...');
    console.log(isSubmitDisabled);
    if (!isSubmitDisabled) {
      onAddPlace(inputs);
      setButtonText('Crear');
      setInputs({ title: '', urlImagen: '' })
      setShowErrors(false);
      setIsSubmitDisabled(true);
    }
  };

  const validate = (inputs) => {
    const newErrors = {};
    if (!inputs.title) {
      newErrors.title = 'El título es obligatorio.';
    } else if (inputs.title.length < 2) {
      newErrors.title = 'El título debe tener al menos 2 caracteres.';
    }

    if (!inputs.urlImagen) {
      newErrors.urlImagen = 'La URL de la imagen es obligatoria.';
    } else if (!/^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp)/.test(inputs.urlImagen)) {
      newErrors.urlImagen = 'La URL debe ser una dirección de imagen válida.';
    }

    setErrors(newErrors);
    setIsSubmitDisabled(Object.keys(newErrors).length > 0);
  };

  useEffect(() => {
    validate(inputs);
  }, [inputs]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value.trim() });
    setShowErrors(true);
  };

  const handleClickClose = () => {
    onClose();
    setInputs({ title: '', urlImagen: '' });
    setIsSubmitDisabled(true);
    setShowErrors(false);
  }


  return (
    <PopupWithForm
      name="addNewImage"
      title="Nuevo Lugar"
      isOpen={isOpen}
      onClose={handleClickClose}
      onSubmit={handleAddPlaceSubmit}
      submitButtonText={buttonText}
      isSubmitDisabled={isSubmitDisabled}
    >
      <input
        type="text"
        name="title"
        className="form__input"
        placeholder="Titulo"
        minLength="2"
        maxLength="30"
        value={inputs.title}
        onChange={handleChange}
        required
      />
      <span className={`empty-field ${showErrors ? "empty-field_error" : ""}`}>{errors.title}</span>

      <input
        type="url"
        name="urlImagen"
        className="form__input"
        placeholder="Image url"
        value={inputs.urlImagen}
        pattern="https://.*"
        onChange={handleChange}
        required
      />
      <span className={`empty-field ${showErrors ? "empty-field_error" : ""}`}>{errors.urlImagen}</span>

    </PopupWithForm>
  );
}

export default AddPlacePopup;
