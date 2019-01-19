class AuthService {
    constructor() {
        this._isLoggedIn = false;
    }

    isLoggedIn() {
        return this._isLoggedIn;
    }

    setIsLoggedIn(isLoggedIn) {
        this._isLoggedIn = isLoggedIn;
    }
}

export const authService = new AuthService();
