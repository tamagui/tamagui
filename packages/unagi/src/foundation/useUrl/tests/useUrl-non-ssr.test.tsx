// import React from 'react';
// import {mount} from '@shopify/react-testing';

// import {useUrl} from '../index.js';

// jest.mock('../../ssr-interop', () => ({
//   META_ENV_SSR: false,
//   useEnvContext: jest.fn(),
// }));

// function FakeComponent({callbackSpy}: {callbackSpy: jest.Mock<any, any>}) {
//   const url = useUrl();
//   callbackSpy(url);
//   return null;
// }

// describe('useUrl() in non SSR', () => {
//   const oldLocation = window.location;

//   beforeEach(() => {
//     Object.defineProperty(window, 'location', {
//       value: {
//         href: '',
//       },
//       writable: true,
//     });
//   });

//   afterEach(() => {
//     Object.defineProperty(window, 'location', oldLocation);
//   });

//   it('returns url object using windows.location.href', () => {
//     const mockUrl =
//       'https://hydrogen-preview.myshopify.com/products/mail-it-in-freestyle-snowboard';

//     window.location.href = mockUrl;
//     const callbackSpy = jest.fn();

//     mount(<FakeComponent callbackSpy={callbackSpy} />);
//     expect(callbackSpy.mock.calls[0].toString()).toBe(mockUrl);
//   });
// });
