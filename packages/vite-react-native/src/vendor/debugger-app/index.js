import { URL, fileURLToPath } from 'url';

export default fileURLToPath(new URL('./dist', import.meta.url));
