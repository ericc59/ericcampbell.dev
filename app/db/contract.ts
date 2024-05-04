import path from 'path';
import { getMDXData } from './project';

export function getContracts() {
  return getMDXData(path.join(process.cwd(), 'content/contracts'));
}
