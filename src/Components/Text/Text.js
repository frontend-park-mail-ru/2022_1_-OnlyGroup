import text from './Text.hbs';
import {BaseComponent} from '../Base/Base';

export const TEXT_TYPES = {
    primary: 'primaryType',
    secondary: 'secondaryType',
    error: 'errorType',
};

/**
 * Text component
 */
export class Text extends BaseComponent {
    /**
     * Create text component
     * @param {string} text
     * @param {string|undefined} type
     * @param {string|null|undefined} href
     * @param {function|undefined} onClick
     */
    constructor({text, type = TEXT_TYPES.primary, href, onClick}) {
        super();
        this.textContent = text;
        this.href = href;
        this.onClick = onClick;
        this[type] = true;
    }

    /**
     * Render text component
     * @return {string}
     */
    render() {
        return text(this);
    }

    /**
     * Mount text component
     */
    mount() {
        super.mount();
        if (this.onClick && this.elem) {
            this.elem.addEventListener('click', this.onClick);
        }
    }

    /**
     * Unmount text component
     */
    unmount() {
        if (this.onClick && this.elem) {
            this.elem.removeEventListener('click', this.onClick);
        }
        super.unmount();
    }

    /**
     * Set text of text component
     * @param {string} text
     */
    setText(text) {
        if (text !== this.textContent) {
            this.textContent = text;
            this.stateChanged = true;
        }
    }
}
