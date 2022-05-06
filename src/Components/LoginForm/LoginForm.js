import loginForm from './LoginForm.hbs';
import {Button} from '../Button/Button';
import {Input} from '../Input/Input';
import {Text} from '../Text/Text';
import {Logo} from '../Logo/Logo';
import {BaseComponent} from '../Base/Base';
import {LOGIN_VIEW_NAMES} from '../../consts/viewConsts';
import {APP_PATHS} from '../../Modules/Router';
import EventBus from '../../Modules/EventBus';
import {LOGIN_REGISTER_EVENTS} from '../../Modules/EventBusEvents';

/**
 * Login form smart component
 */
export default class LoginForm extends BaseComponent {
    /**
     * Create login form component
     */
    constructor() {
        super({});
        this.setEvents({
            [LOGIN_REGISTER_EVENTS.clearForm]: this.clear,
            [LOGIN_REGISTER_EVENTS.userValidationFailed]: this.setErrors,
            [LOGIN_REGISTER_EVENTS.userNotLoggined]: this.setUnloggined,
        });
    }

    /**
     * Create all components on page
     */
    initComponents() {
        this.components.logo = new Logo({styles: []});
        this.components.emailInput = new Input({
            type: 'text',
            label: LOGIN_VIEW_NAMES.inputs.email.title,
            placeholder: LOGIN_VIEW_NAMES.inputs.email.placeholder,
            styles: ['auth-form__input'],
        });
        this.components.passwordInput = new Input({
            type: 'password',
            label: LOGIN_VIEW_NAMES.inputs.password.title,
            placeholder: LOGIN_VIEW_NAMES.inputs.password.placeholder,
            styles: ['auth-form__input'],
        });
        this.components.mainError = new Text({
            text: '',
            styles: ['auth-form__main-error'],
        });
        this.components.button = new Button({
            text: LOGIN_VIEW_NAMES.buttonTittle,
            styles: ['auth-form__button'],
            onClick: this.onButtonClick,
        });

        this.components.registerContainer = new BaseComponent({styles: ['auth-form__alt-variant', 'alt-variant']});
        this.components.registerContainer.components.registerOffer = new Text({
            text: LOGIN_VIEW_NAMES.registerOffer,
            styles: ['alt-variant__text'],
        });
        this.components.registerContainer.components.registerLink = new Text({
            text: LOGIN_VIEW_NAMES.registerLinkTittle,
            styles: ['alt-variant__link'],
            href: APP_PATHS.registerPage,
        });
    }

    /**
     * @callback Callback for button click
     * @param {Event} ev
     */
    onButtonClick = (ev) => {
        this.formSubmit(ev);
    }

    /**
     * @callback Callback for form submit
     * @param {Event} ev
     */
    formSubmit = (ev) => {
        ev.preventDefault();
        const email = this.components.emailInput.getValue();
        const password = this.components.passwordInput.getValue();
        EventBus.emitEvent(LOGIN_REGISTER_EVENTS.actionLogin, {email, password});
    }

    /**
     * Render login form component
     * @return {string}
     */
    render() {
        this.prepareRender();
        return loginForm(this);
    }

    /**
     * Set user not loggined
     */
    setUnloggined = () => {
        this.setErrors({email: '', password: '', main: LOGIN_VIEW_NAMES.userLoginFailed});
        this.reRender();
    }

    /**
     * Set errors
     * @param {string} email
     * @param {string} password
     * @param {string|undefined} main
     */
    setErrors = ({email, password, main}) => {
        this.components.emailInput.setError(email);
        this.components.passwordInput.setError(password);
        if (main !== undefined) {
            this.components.mainError.setText(main);
        }
        // TODO  щас сразу при переходе на логин пишет ошибку, разобраться
        this.reRender();
    }

    /**
     * Mount login form component
     */
    mount() {
        super.mount();
        if (this.elem) {
            this.elem.addEventListener('submit', this.formSubmit);
        }
    }

    /**
     * Unmount login form component
     */
    unmount() {
        if (this.elem) {
            this.elem.removeEventListener('submit', this.formSubmit);
        }
        super.unmount();
    }

    /**
     * Clear all inputs
     */
    clear = () => {
        this.components.emailInput.clear();
        this.components.passwordInput.clear();
    }
}
