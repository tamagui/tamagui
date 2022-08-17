// import React from 'react';
// import {mount} from '@shopify/react-testing';

// import {useUrl} from '../index.js';
// import {RSC_PATHNAME} from '../../../constants.js';

// jest.mock('../../ssr-interop', () => ({
//   META_ENV_SSR: true,
//   useEnvContext: jest.fn(),
// }));

// const useEnvContextMock: jest.Mock =
//   jest.requireMock('../../ssr-interop').useEnvContext;

// function FakeComponent({callbackSpy}: {callbackSpy: jest.Mock<any, any>}) {
//   const url = useUrl();
//   callbackSpy(url);
//   return null;
// }

// describe('useUrl() in SSR', () => {
//   afterEach(() => {
//     useEnvContextMock.mockReset();
//   });

//   it('returns url object using useServerRequest url', () => {
//     const mockUrl =
//       'https://hydrogen-preview.myshopify.com/collections/freestyle';

//     useEnvContextMock.mockReturnValue(mockUrl);
//     const callbackSpy = jest.fn();

//     mount(<FakeComponent callbackSpy={callbackSpy} />);

//     expect(callbackSpy.mock.calls[0].toString()).toBe(mockUrl);
//   });

//   it(`returns url object using a parsed url from state param and origin when the pathname is ${RSC_PATHNAME}`, () => {
//     const origin = 'https://hydrogen-preview.myshopify.com';
//     const state = {pathname: '/collections/freestyle'};

//     const mockUrl = `${origin}${RSC_PATHNAME}?state=${encodeURIComponent(
//       JSON.stringify(state)
//     )}`;

//     useEnvContextMock.mockReturnValue(mockUrl);
//     const callbackSpy = jest.fn();

//     mount(<FakeComponent callbackSpy={callbackSpy} />);

//     expect(callbackSpy.mock.calls[0].toString()).toBe(
//       `${origin}${state.pathname}`
//     );
//   });
// });
