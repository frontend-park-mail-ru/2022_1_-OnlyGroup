import {SignInValidation} from '../validate/signInValidate.js';
import router from "../../router/router.js";

/**
 * Sign in events
 */
export class SignInForm {
  /**
    * Event of form submit
    * @param {Event} event
    */
  static formSubmitEvent(event) {
    event.preventDefault();

    const errors = SignInValidation.
        inputsValidate(document.querySelectorAll('.form__input__require'));

    if (errors === 0) {

      router.go("/profile");
      // const button = document.querySelector('.form__button');
      // button.setAttribute('onclick', 'window.location.href="/profile"');
      // button.click();
    }
  }
}
