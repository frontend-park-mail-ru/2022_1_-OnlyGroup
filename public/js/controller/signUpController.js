import { SignUpValidation } from '../validate/signUpValidate.js';
import {userApi} from "../api/api.js";
import {Errors} from "../modules/errors.js";
import activeUser from "../api/userApi.js";
// import {SignInValidation} from "../validate/signInValidate";

export class SignUpController {
    /**
     * Event of form submit
     * @param {Event} event
     */
    static formSubmitEvent = async (event) => {
        event.preventDefault();

        let errors = SignUpValidation.inputsValidate(document.querySelectorAll('.form__input__require'));

        if (errors !== 0) {
            return;
        }

        const form = document.querySelectorAll('.form__input__require');

        let emailField, passwordField;
        form.forEach(field => {
            if (field.classList.contains('form__login')) {
                emailField = field;
            }
            if (field.classList.contains('form__password')) {
                passwordField = field;
            }
        })

        let userId;
        try{
            userId = await userApi.logUp(emailField.value, passwordField.value)
        } catch (e){
            Errors.setErrorVisible(passwordField, 'visible', "Email already used");
            return;
        }
        activeUser.id = userId;

        const button = document.querySelector('.form__button');
        button.setAttribute('onclick', "window.location.href='/profile'");
        button.click();
    }
}
