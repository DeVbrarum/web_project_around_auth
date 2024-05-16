import React, { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import trashIcon from '../images/Icons/trash.png';
import heartIcon from '../images/Icons/wheart.png';

function Card(props) {
    const currentUser = useContext(CurrentUserContext);

    //Verify that the current user is the owner of the images
    const isOwner = props.card.owner._id === currentUser._id;

    const isLiked = props.card.likes.some(like => like._id === currentUser._id);

    function handleClick() {
        props.onCardClick(props.card);
    }

    function handleLikeClick() {
        props.onCardLike(props.card);
    }

    function handleDeleteClick() {
        props.onCardDelete(props.card);
    }

    return (
        <div key={props.card._id} className="photos__template">
            <div className="photos__content">
                {isOwner && (
                    <button className="photos__trash-button" onClick={handleDeleteClick}>

                        <img
                            src={trashIcon}
                            alt="trash icon"
                            className="photos__trash-icon"
                        />
                    </button>
                )}
                <button className="photos__imgPopup-button" onClick={handleClick}>
                    <img src={props.card.link || 'default-image.png'} alt={props.card.name || 'Default Image'} className="photos__img" />
                </button>
                <div className="photos__info">
                    <h2 className="photos__title">{props.card.name}</h2>
                    <div className="photos__like-countainer">
                        <button className="photos__like-button" onClick={handleLikeClick}>
                            <img
                                src={heartIcon}
                                alt="icon like heart"
                                className={`icon_like-heart ${isLiked ? "icon_like-heart_activated" : "icon_like-heart"}`}
                            />
                        </button>
                        <div className="photos__like-count">{props.card.likes.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
