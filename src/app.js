import router, {APP_PATHS} from './Modules/Router.js';
import loginController from './Controllers/LoginController/LoginController';
import registerController from './Controllers/RegisterController/RegisterController';
import './style.scss';
import feedController from './Controllers/FeedController/FeedController';

router.register(APP_PATHS.loginPage, loginController);
router.register(APP_PATHS.registerPage, registerController);
router.register(APP_PATHS.findCandidatePage, feedController);
router.register(APP_PATHS.profilePage, feedController);
router.register(APP_PATHS.matchesPage, feedController);
router.register(APP_PATHS.messagesPage, feedController);
router.register(APP_PATHS.settingsPage, feedController);

router.start();
