import { Event } from 'nanoevent';

export class CanvasEvents {

    mounted = new Event<void>();
    unmounted = new Event<void>();

}
