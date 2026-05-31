import { relative } from 'path';

export default {
  "*.{js,ts,tsx}": (files) => {
    const relFiles = files.map(file => relative(process.cwd(), file)).join(',');
    return `pnpm exec nx affected -t lint --files=${relFiles}`;
  },
  "*.{css,scss}": (files) => {
    const relFiles = files.map(file => relative(process.cwd(), file)).join(',');
    return `pnpm exec nx affected -t lint --files=${relFiles}`;
  },
  "*.{md,json}": [
    "prettier --write"
  ]
};
