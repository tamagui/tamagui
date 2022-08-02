# API Routes Example

An example of using API routes on Hydrogen.

- [`newsletter.server.jsx`](./src/routes/newsletter.server.jsx) exports an `api` function, enabling POST requests to `/newsletter`.

- [`NewsletterForm.client.jsx`](./src/components/NewsletterForm.client.jsx) contains the form which posts the data.

[Run this example on StackBlitz](https://stackblitz.com/fork/github/shopify/hydrogen/tree/stackblitz/examples/api-routes)

## Getting started

1. Clone this example.

```bash
npx degit Shopify/hydrogen/examples/api-routes hydrogen-app
yarn
yarn dev
```

2. With developer tools open, submit the form to see the API route in action.
