import { mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.base.config';

export default mergeConfig(baseConfig, {
  test: {
    name: 'modules',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  },
});
