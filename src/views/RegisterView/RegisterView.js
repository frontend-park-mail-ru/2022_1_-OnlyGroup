import {BaseView} from '../BaseView/BaseView.js';
import registerView from './RegisterView.hbs';
import EventBus from '../../Modules/EventBus';
import RegisterFormComponent from '../../Components/RegisterForm/RegisterForm';

/**
 * View class for login page
 */
export class RegisterView extends BaseView {
    #registerForm;

    /**
     * Create login BaseView
     * @param {HTMLElement}parent
     */
    constructor({parent}) {
        super({parent});
        this.#registerForm = new RegisterFormComponent({
            onSubmit: this.registerFormSubmit,
            onLogoClick: this.logoClick,
            onLoginClick: this.loginLinkClick,
        });
    }

    /**
     * Render BaseView and mount components
     */
    render() {
        this.renderedComponents = this.#registerForm.render();
        this.parent.innerHTML = registerView(this);
        this.#registerForm.mount();
    }

    /**
     * Rerender BaseView
     */
    reRender() {
        this.unmount();
        this.render();
    }

    /**
     * @callback Callback for logo click
     */
    logoClick = () => {
        EventBus.emitEvent('logo-click');
    }

    /**
     * Callback for register form submit
     * @param {string}email
     * @param {string}password
     * @param {string}passwordRepeat
     */
    registerFormSubmit({email, password, passwordRepeat}) {
        EventBus.emitEvent('action-register', {email, password, passwordRepeat});
    }

    /**
     * Set errors in login form and rerender
     * @param {string}email
     * @param {string}password
     * @param {string}passwordRepeat
     * @param {string}main
     */
    setErrors({email, password, passwordRepeat, main}) {
        this.#registerForm.setErrors({email, password, passwordRepeat, main});
    }

    /**
     * Unmount BaseView
     */
    unmount() {
        this.#registerForm.unmount();
    }
}
