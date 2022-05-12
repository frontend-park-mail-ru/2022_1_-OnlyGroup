import EventBus from './EventBus';
import {REDIRECT} from './EventBusEvents';

export const APP_PATHS = {
    profilePage: '/',
    loginPage: '/login',
    registerPage: '/register',
    messagesPage: '/messages',
    matchesPage: '/matches',
    findCandidatePage: '/find',
    settingsPage: '/settings',
    notFoundPage: '/404',
};

/**
 * Router
 */
export class Router {
    #routes;
    #currentRoute;

    /**
     * Create router
     */
    constructor() {
        this.#routes = {};
        this.#currentRoute = undefined;
    }

    /**
     * Go to path
     * @param {string} path
     */
    go = ({path}) => {
        path = (path) ? path : '/';
        if (this.#currentRoute === this.#routes[path]) {
            window.history.pushState(null, null, path);
            this.#currentRoute.changeUrl({url: path});
            return;
        }
        this.#currentRoute.stop();
        if (typeof this.#routes[window.location.pathname] !== undefined) {
            window.history.pushState(null, null, path);
            this.#currentRoute = this.#routes[path];
            this.#currentRoute.start({url: window.location.pathname});
            return;
        }

        this.#routes[APP_PATHS.notFoundPage].start();
    }

    /**
     * Redirect to page by path
     * @param {*} path
     */
    redirect(path) {
        window.history.pushState(null, null, path);
    }

    /**
     * Register path
     * @param {string} path
     * @param {BaseController} controller
     */
    register(path, controller) {
        this.#routes[path] = controller;
    }

    /**
     * Render page
     */
    start() {
        window.addEventListener('click', (event) => {
            let parentElem = event.target;
            while (parentElem) {
                if (parentElem.tagName === 'A') {
                    event.preventDefault();
                    this.go({path: parentElem.pathname});
                    break;
                }

                parentElem = parentElem.parentElement;
            }
        });

        window.addEventListener('popstate', (event) => {
            event.preventDefault();
            this.go({path: window.location.pathname});
        });

        EventBus.addEventListener(REDIRECT, this.go);

        this.#currentRoute = this.#routes[window.location.pathname];
        this.#currentRoute.start({url: window.location.pathname});
    }
}

export default new Router();
