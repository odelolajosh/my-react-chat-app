

class ErrorHandler {
    FAILED_TO_FETCH = "failed to fetch";

    AN_ERROR_OCCURRED = "An Error Occurred";
    POOR_INTERNET_CONNECTION = "Poor Internet Connection";
    UNAUTHENTICATED_USER = "You have to Login";
    USER_NOT_FOUND = "User not found";

    checkErrorBool = (err) => err && err.message !== null;

    getErrorRemark(err) {
        err = this.normalizeError(err);
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