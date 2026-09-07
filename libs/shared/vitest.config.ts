import { mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.base.config';

export default mergeConfig(baseConfig, {
  test: {
    name: 'shared',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  },
});
