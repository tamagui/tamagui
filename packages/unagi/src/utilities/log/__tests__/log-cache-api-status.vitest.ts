import {vi, type Mocked} from 'vitest';
import {stripColors} from 'kolorist';
import {Logger, setLogger} from '../index.js';
import {logCacheApiStatus} from '../log-cache-api-status.js';

let mockedLogger: Mocked<Logger>;

describe('cache header log', () => {
  beforeEach(() => {
    mockedLogger = {
      trace: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      options: vi.fn(() => ({})),
    };

    setLogger({...mockedLogger, showCacheApiStatus: true});
  });

  afterEach(() => {
    setLogger(undefined);
  });

  it('should log cache api status', () => {
    logCacheApiStatus(
      'HIT',
      'https://shopify.dev/?%22__QUERY_CACHE_ID__%22%22hydrogen-preview.myshopify.com%22%22unstable%22%22%7B%5C%22query%5C%22:%5C%22query%20shopInfo%20%7B%5C%5Cn%20%20shop'
    );

    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual({});
    expect(
      stripColors(mockedLogger.debug.mock.calls[0][1])
    ).toMatchInlineSnapshot('"[Cache] HIT      query shopInfo"');
  });
});
