/* @flow strict */
import paths from 'path';

export function parent(dir: string): ?string {
  if (paths.basename(dir) === 'node_modules') {
    return dir;
  }

  const parent_ = paths.resolve(dir, '..');
  if (parent_ !== dir) {
    return parent(parent_);
  }
  return null;
}
