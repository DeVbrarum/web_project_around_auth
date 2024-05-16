import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { validateToken } from '../utils/auth';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Register from './Register';
import Login from './Login';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import ProtectedRoute from './ProtectedRoute';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmPopup from './ConfirmPopup';

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [userFromToken, setUserFromToken] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');
  const [cards, setCards] = useState([]);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState('');
  const [token, setToken] = useState(localStorage.getItem('jwt'));


  useEffect(() => {
    if (token) {
      validateToken(token)
        .then((data) => {
          setIsAuthenticated(true);
          setUserFromToken(data);
        })
        .catch(() => {
          localStorage.removeItem('jwt');
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const handleLogin = (data) => {
    localStorage.setItem('jwt', data.token);
    setIsAuthenticated(true);
    setToken(data.token);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    setCurrentUser({});
  };

  useEffect(() => {
    if (isAuthenticated) {
      api.getUserData()
        .then((userInfo) => {
          setCurrentUser((prevState) => ({
            ...userInfo,
            email: userFromToken.email,
          }));
        })
        .catch((error) => {
          console.error(`Error al obtener la información del usuario: ${error}`);
        });

      api.getInitialCards()
        .then((cardsData) => {
          setCards(cardsData);
        })
        .catch((error) => console.error(`Error: ${error}`));
    }
  }, [isAuthenticated, userFromToken]);

  const handleDeleteConfirm = () => {
    if (cardToDelete) {
      return api.deleteCard(cardToDelete._id)
        .then(() => {
          setCards((prevCards) => prevCards.filter((card) => card._id !== cardToDelete._id));
          setIsConfirmPopupOpen(false);
        })
        .catch((error) => console.error(`Error al eliminar la tarjeta: ${error}`));
    }
  };

  const handleUpdateAvatar = ({ avatar }) => {
    return api.updateProfilePicture(avatar)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((error) => {
        console.error(`Error al actualizar el avatar: ${error}`);
      });
  };

  const handleUpdateUser = ({ name, about }) => {
    return api.updateProfile(name, about)
      .then((updateUserData) => {
        setCurrentUser(updateUserData);
        closeAllPopups();
      })
      .catch((error) => {
        console.error(`Error al actualizar el usuario: ${error}`)
        throw error;
      });
  }

  const handleAddPlaceSubmit = (inputs) => {
    api.addCard(inputs.title, inputs.urlImagen)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.error(`Error al agregar una nueva tarjeta: ${error}`);
      });
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard(null);
  };

  if (isLoading) {
    return <div>Cargando...</div>;  // Puedes usar un spinner o cualquier indicador de carga aquí
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(card => card._id === currentUser._id);

    (isLiked ? api.unlikeCard(card._id) : api.likeCard(card._id))
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((error) => console.error(`Error al actualizar el like de la tarjeta: ${error}`));

  }

  function handleCardDelete(card) {
    setCardToDelete(card);
    setIsConfirmPopupOpen(true);
  }

  return (
    <Router basename="/around-react_es">
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          <Routes>
            <Route path="/signin" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute
                component={Main}
                isAuthenticated={isAuthenticated}
                user={currentUser}
                onEditProfileClick={() => setIsEditProfilePopupOpen(true)}
                onAddPlaceClick={() => setIsAddPlacePopupOpen(true)}
                onEditAvatarClick={() => setIsEditAvatarPopupOpen(true)}
                onCardClick={(card) => setSelectedCard(card)}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            } />
          </Routes>
          <ImagePopup card={selectedCard} onClose={() => setSelectedCard(null)} />
          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={() => setIsEditAvatarPopupOpen(false)} onUpdateAvatar={handleUpdateAvatar} />
          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={() => setIsEditProfilePopupOpen(false)} onUpdateUser={handleUpdateUser} />
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={() => setIsAddPlacePopupOpen(false)} onAddPlace={handleAddPlaceSubmit} />
          <ConfirmPopup isOpen={isConfirmPopupOpen} onClose={() => setIsConfirmPopupOpen(false)} onConfirm={handleDeleteConfirm} />
          <Footer />
        </div>
      </CurrentUserContext.Provider>
    </Router>
  );
}

export default App;
