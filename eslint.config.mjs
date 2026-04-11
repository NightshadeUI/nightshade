import { sharedConfigs } from '@luminable/eslint-config';
import { vueConfigs } from '@luminable/eslint-config-vue';

export default [
    ...sharedConfigs,
    ...vueConfigs,
    {
        rules: {
            'import/no-extraneous-dependencies': 'off'
        }
    }
];
