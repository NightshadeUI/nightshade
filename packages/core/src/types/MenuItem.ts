export interface MenuItem {
    type?: 'normal' | 'header' | 'separator';
    title?: string;
    value?: any;
    icon?: string;
    kind?: string;
    outline?: boolean;
    ghost?: boolean;
    disabled?: boolean;
    checked?: boolean;
    activate?: () => void;
    children?: MenuItem[];
}
