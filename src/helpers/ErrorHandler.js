

class ErrorHandler {
    FAILED_TO_FETCH = "failed to fetch";

    AN_ERROR_OCCURRED = "an error occurred";
    POOR_INTERNET_CONNECTION = "poor internet connection";
    UNAUTHENTICATED_USER = "you have to login";
    USER_NOT_FOUND = "user not found";

    checkErrorBool = (err) => err && err.message !== null;

    getErrorRemark(err) {
        err = this.normalizeError(err);
        console.log(err.message)
        switch (err.message) {
            case this.FAILED_TO_FETCH:
                return this.POOR_INTERNET_CONNECTION;
            case this.UNAUTHENTICATED_USER:
            case this.USER_NOT_FOUND:
            case this.POOR_INTERNET_CONNECTION:
                return err.message
            default:
                return this.AN_ERROR_OCCURRED;
        }
    }

    async getResponseError(response) {
        if (!response) {
            return new Error(this.AN_ERROR_OCCURRED);
        }
        switch (response.status) {
            case 401:
                return new Error(this.UNAUTHENTICATED_USER);
            case 404:
                return new Error(this.USER_NOT_FOUND);
            default: 
            return new Error(this.AN_ERROR_OCCURRED);
        }
    }

    normalizeError(err) {
        if (!this.checkErrorBool(err)) {
            return new Error(this.AN_ERROR_OCCURRED);
        }
        err.message = err.message.toLowerCase();
        return err;
    }

}

export default new ErrorHandler();