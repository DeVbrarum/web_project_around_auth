import React, { useContext } from "react"
import plusIcon from '../images/Icons/plusIcon.png';
import editIcon from '../images/Icons/editIcon.png';
import Card from "./Card";
import CurrentUserContext from "../contexts/CurrentUserContext";


function Main({ onEditProfileClick, onAddPlaceClick, onEditAvatarClick, onCardClick, cards, onCardLike, onCardDelete }) {
    const currentUser = useContext(CurrentUserContext);

    return (
        <main>
            <section className="profile">
                <div className="profile__avatar">
                    <img
                        src={currentUser.avatar}
                        alt="Avatar del usuario"
                        className="profile__avatar-image"
                    />
                    <div className="profile__edit-icon" onClick={onEditAvatarClick}></div>
                </div>

                <div className="profile__info">
                    <div className="profile__info-content">
                        <h2 className="profile__info-name">{currentUser.name}</h2>
                        <button
                            className="profile__editUserButton" onClick={onEditProfileClick}
                        >
                            <img src={editIcon} alt="Edit user button" />
                        </button>
                    </div>
                    <h3 className="profile__info-about">{currentUser.about}</h3>
                </div>
                <button
                    className="profile__addCardButton"
                    onClick={onAddPlaceClick}
                >
                    <img src={plusIcon} alt="Add card icon button" />
                </button>
            </section>

            <section className="photos">
                {cards.map((card) => (
                    <Card
                        key={card._id}
                        card={card}
                        onCardClick={onCardClick}
                        onCardLike={onCardLike}
                        onCardDelete={onCardDelete}
                    />
                ))}
            </section>
        </main>
    );
};

export default Main;
