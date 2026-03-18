export function collectProps(component: any, propKeys: string[]): Record<string, any> {
    const props: Record<string, any> = {};
    for (const key of propKeys) {
        props[key] = (component as any)[key];
    }
    return props;
}
