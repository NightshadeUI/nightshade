import { sharedConfigs } from '@flexent/eslint-config';
import { vueConfigs } from '@flexent/eslint-config-vue';

export default [
    ...sharedConfigs,
    ...vueConfigs,
    {
        rules: {
            'import/no-extraneous-dependencies': 'off'
        }
    },
    {
        ignores: [
            '**/.vitepress/cache',
        ]
    }
];
