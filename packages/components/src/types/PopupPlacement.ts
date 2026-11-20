/** The side a popup opens towards; `v` and `h` pick the side with more room. */
export type PopupDir = 'top' | 'bottom' | 'left' | 'right' | 'v' | 'h';

/** Where the arrow lands along the popup's edge; `auto` opens towards the middle of the viewport. */
export type PopupAlign = 'start' | 'center' | 'end' | 'auto';
