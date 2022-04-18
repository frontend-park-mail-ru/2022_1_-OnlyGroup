const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordPatternLowerCase = `[a-z]+`;
const passwordPatternUpperCase = `[A-Z]+`;
const passwordPatternNumber = `[0-9]+`;
const passwordMinLength = 6;
const passwordMaxLength = 32;

/**
 * Validators class
 */
export default class Validators {
    /**
     * Validate email
     * @param {string} email
     * @return {RegExpMatchArray}
     */
    static validateEmail(email) {
        return String(email).toLowerCase().match(emailPattern);
    }


    /**
     * Validate password
     * @param {string} password
     * @return {boolean|RegExpMatchArray}
     */
    static validatePassword(password) {
        const passwordString = String(password);
        if (passwordString.length < passwordMinLength || passwordString.length > passwordMaxLength) {
            return false;
        }
        return passwordString.match(passwordPatternLowerCase) && passwordString.match(passwordPatternUpperCase) &&
            passwordString.match(passwordPatternNumber);
    }

    /**
     * Validate all user credentials(email, password, repeatPassword)
     * @param {string} email
     * @param {string} password
     * @param {string} passwordRepeat
     * @return {null|{password: boolean, passwordRepeat: boolean, email: boolean}}
     */
    static validateEmailPasswordRepeatPassword({email, password, passwordRepeat = null}) {
        let validationFailed = false;
        let validationError = {'email': false, 'password': false, 'passwordRepeat': false};
        if (!this.validateEmail(email)) {
            validationFailed = true;
            validationError.email = true;
        }
        if (!this.validatePassword(password)) {
            validationFailed = true;
            validationError.password = true;
        }
        passwordRepeat = (passwordRepeat === undefined) ? null : passwordRepeat;
        if (passwordRepeat && passwordRepeat !== password) {
            validationError.passwordRepeat = true;
            validationError = true;
        }
        if (validationFailed) {
            return validationError;
        }
        return null;
    }
}
