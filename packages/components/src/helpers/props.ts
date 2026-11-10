function toKebabCase(value: string): string {
    return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function hasOwnProp(source: Record<string, unknown>, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(source, key);
}

/**
 * Whether the parent set the prop. A bound `undefined` (`:tone="item.tone"`) counts as unset,
 * so `$nightshade.defaults` still reach it.
 */
function hasExplicitProp(instance: any, key: string): boolean {
    const vnodeProps = instance?.$?.vnode?.props || {};
    const name = hasOwnProp(vnodeProps, key) ? key : toKebabCase(key);
    return hasOwnProp(vnodeProps, name) && vnodeProps[name] !== undefined;
}

export const nightshadeMixin = {
    inject: {
        $nightshade: {
            default: null,
        },
    },

    computed: {
        resolvedProps() {
            return resolveProps(this, (this as any).$options);
        },
    },
};

export function resolveProps(instance: any, targetComponent: any): Record<string, any> {
    const props: Record<string, any> = {};
    const componentProps = targetComponent?.props || {};
    const propKeys = Object.keys(componentProps);
    const defaults = instance?.$nightshade?.defaults || {};
    for (const key of propKeys) {
        if (hasExplicitProp(instance, key)) {
            props[key] = (instance.$props as any)[key];
            continue;
        }
        if (hasOwnProp(defaults, key)) {
            props[key] = defaults[key];
            continue;
        }
        props[key] = (instance.$props as any)[key];
    }
    return props;
}

export function collectProps(instance: any, targetComponent: any): Record<string, any> {
    const props: Record<string, any> = {};
    const resolved = instance?.resolvedProps || resolveProps(instance, instance?.$options);
    const propKeys = Object.keys(targetComponent.props || {});
    for (const key of propKeys) {
        props[key] = resolved[key];
    }
    return props;
}
