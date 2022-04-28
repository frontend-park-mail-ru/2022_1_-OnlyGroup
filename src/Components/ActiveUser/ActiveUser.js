import {BaseComponent} from '../Base/Base';
import {Text} from '../Text/Text';
import activeUser from './ActiveUser.hbs';
import Photo from '_components/Photo/Photo';
import EventBus from '../../Modules/EventBus';

/**
 * Feed left top active user component
 */
export class ActiveUserComponent extends BaseComponent {
    /**
     * Create active user component
     * @param {Array}styles
     */
    constructor({styles}) {
        super({styles});
        this.ready = false;
        this.setEvents({
            'activeUser-ready-min': this.onReady,
        });
    }

    /**
     * Ready to place info
     */
    onReady = ({avatar, info}) => {
        this.ready = true;
        if (avatar) {
            this.components.avatar = new Photo({
                styles: ['avatar'],
                loadEvent: `avatar-load-${avatar}`,
                onLoadEvent: `avatar-ready-${avatar}`,
                loaderEnabled: true,
            });
        } else {
            this.components.avatar = new Photo({
                styles: ['avatar'],
                src: 'static/images/logo.png',
            });
        }
        this.components.column = new BaseComponent({
            styles: ['flex', 'flex-column', 'justify-content-center', 'align-item-center'],
        });
        this.components.column.components.name = new Text({
            text: `${info.firstName} ${info.lastName}`,
            styles: [],
        });
        this.components.column.components.city = new Text({
            text: `${info.city}`,
            styles: [],
        });
        this.stateChanged = true;
        this.reRender();
    }

    /**
     * Render active user component
     * @return {string}
     */
    render() {
        this.prepareRender();
        return activeUser(this);
    }

    /**
     * Mount active user component
     */
    mount() {
        super.mount();
        if (!this.ready) {
            EventBus.emitEvent('activeUser-load-min');
        }
    }
}