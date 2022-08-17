import type {RenderType} from './log.js';

export function findQueryName(key: string) {
  if (key.length < 100) {
    return key.replace('"__QUERY_CACHE_ID__"', '').replace(/"/g, '');
  }

  return key.match(/query\s+([^\s({]+)/)?.[1] || '<unknown>';
}

export function parseUrl(type: RenderType, url: string) {
  return type === 'rsc'
    ? decodeURIComponent(url.substring(url.indexOf('=') + 1))
    : url;
}
