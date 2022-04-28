import {IP, PORT} from '../Modules/FetchWrap';
import {Api, PHOTO_API_URL} from '../Modules/Api';
import EventBus from '../Modules/EventBus';
import {API_FAILED} from '../Modules/EventBusEvents';

/**
 * User photo model
 */
export class Photo {
    id;
    image;
    photoReady;
    paramsReady;
    loading;
    emitOnLoad;
    authorId;
    leftTopX;
    leftTopY;
    rightBottomX;
    rightBottomY;

    /**
     * Create user photo
     * @param {number|undefined} id
     * @param {boolean} isAvatar
     * @param {number|undefined} userId
     */
    constructor({id, userId, isAvatar = false}) {
        this.id = id;
        this.image = null;
        this.photoReady = false;
        this.paramsReady = false;
        this.loading = false;
        this.emitOnLoad = false;
        this.isAvatar = isAvatar;
        this.userId = userId;
    }

    /**
     * Start photo model processing feed
     */
    startFeed() {
        EventBus.addEventListener(`photo-get-${this.id.toString()}`, this.getPhoto);
    }

    /**
     * Stop photo model processing feed
     */
    stopFeed() {
        EventBus.removeEventListener(`photo-get-${this.id.toString()}`, this.getPhoto);
    }

    /**
     * Start photo processing avatars
     */
    startAvatar() {
        if (this.id) {
            EventBus.addEventListener(`avatar-get-${this.id.toString()}`, this.getPhoto);
        }
    }

    /**
     * stop photo processing avatars
     */
    stopAvatar() {
        if (this.id) {
            EventBus.removeEventListener(`avatar-get-${this.id.toString()}`, this.getPhoto);
        }
    }

    /**
     * Emit ready event
     */
    emitReady() {
        const eventName = (this.isAvatar) ? `avatar-ready-${this.id.toString()}` : `photo-ready-${this.id.toString()}`;
        EventBus.emitEvent(eventName, {
            image: this.image,
            leftTopX: this.leftTopX,
            leftTopY: this.leftTopY,
            rightBottomX: this.rightBottomX,
            rightBottomY: this.rightBottomY,
        });
    }

    /**
     * Get photo if its ready
     */
    getPhoto = () => {
        if (this.paramsReady && this.photoReady) {
            this.emitOnLoad = false;
            this.emitReady();
            return;
        }
        if (!this.loading) {
            this.load();
        }
        this.emitOnLoad = true;
    }

    /**
     * Load image
     */
    load = async () => {
        this.loading = true;

        if (this.isAvatar) {
            const result = await Api.GetAvatar({userId: this.userId});
            if (result.Status === 404) {
                this.id = null;
                return;
            }
            if (!result.isOk()) {
                EventBus.emitEvent(API_FAILED, result);
                return;
            }
            this.id = result.Body.Avatar;
            this.image = new Image();
            this.image.src = `${IP + PORT}/${PHOTO_API_URL}/${this.id.toString()}`;
            this.image.addEventListener('load', this.onLoadImage);
            this.leftTopX = result.Body.Params.LeftTop[0];
            this.leftTopY = result.Body.Params.LeftTop[1];
            this.rightBottomX = result.Body.Params.RightBottom[0];
            this.rightBottomY = result.Body.Params.RightBottom[1];
        } else {
            this.image = new Image();
            this.image.src = `${IP + PORT}/${PHOTO_API_URL}/${this.id.toString()}`;
            this.image.addEventListener('load', this.onLoadImage);

            const result = await Api.GetPhotoParams({id: this.id});
            if (!result.isOk()) {
                return;
            }
            this.leftTopX = result.Body.LeftTop[0];
            this.leftTopY = result.Body.LeftTop[1];
            this.rightBottomX = result.Body.RightBottom[0];
            this.rightBottomY = result.Body.RightBottom[1];
        }

        this.paramsReady = true;
        if (this.emitOnLoad && this.photoReady) {
            this.getPhoto();
        }
    }

    onLoadImage = () => {
        this.image.removeEventListener('load', this.onLoadImage);
        this.photoReady = true;
        if (this.emitOnLoad && this.paramsReady) {
            this.getPhoto();
        }
    }
}