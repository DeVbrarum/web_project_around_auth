class Api {
    constructor(options) {
        this._baseUrl = options.baseUrl;
        this._headers = options.headers;
    }

    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
            method: "GET",
            headers: this._headers,
        })
            .then(this._checkResponse)
            .catch((error) => console.error("No se pudieron recuperar los datos de las tarjetas:", error));
    }

    getUserData() {
        return fetch(`${this._baseUrl}/users/me`, {
            method: "GET",
            headers: this._headers,
        })
            .then(this._checkResponse)
            .catch((error) => console.error("No se pudieron recuperar los datos del usuario:", error));
    }


    updateProfile(name, about) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify({
                name,
                about,
            }),
        })
            .then(this._checkResponse)
            .catch((error) => {
                console.error("Error al actualizar el perfil:", error);
                throw error;
            });
    }


    updateProfilePicture(newAvatarUrl) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: newAvatarUrl
            })
        })
            .then(this._checkResponse)
            .catch(error => {
                console.error('Error al actualizar la foto de perfil:', error);
            });
    }

    addCard(name, link) {
        const cardName = name;
        const cardLink = link;

        return fetch(`${this._baseUrl}/cards`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({
                name: cardName,
                link: cardLink,
            }),
        })
            .then(this._checkResponse)
            .catch((error) => {
                console.error("Error al actualizar el perfil:", error);
            });
    }

    deleteCard(cardID) {
        return fetch(`${this._baseUrl}/cards/${cardID}`, {
            method: "DELETE",
            headers: this._headers,
        })
            .then(this._checkResponse)
            .catch((error) => console.error("Error al eliminar la tarjeta:", error));
    }

    likeCard(cardId) {
        return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: this._headers,
        })
            .then(this._checkResponse);
    }

    unlikeCard(cardId) {
        return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: this._headers,
        })
            .then(this._checkResponse);
    }

    _checkResponse(response) {
        if (!response.ok) {
            return Promise.reject(`Error: ${response.statusText}`);
        }
        return response.json();
    }
}

const api = new Api({
    baseUrl: `https://around.nomoreparties.co/v1/web_es_11`, // URL base de tu API
    headers: {
        authorization: 'ba812068-4270-4077-a7da-dadcfc552381',
        'Content-Type': 'application/json'
    }
});

export default api;
