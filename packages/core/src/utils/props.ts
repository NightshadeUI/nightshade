export function collectProps(instance: any, targetComponent: any): Record<string, any> {
    const props: Record<string, any> = {};
    const propKeys = Object.keys(targetComponent.props || {});
    for (const key of propKeys) {
        props[key] = (instance.$props as any)[key];
    }
    return props;
}
