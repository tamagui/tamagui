export function getErrorMarkup(error: Error) {
  return `<script type="module">
    import {ErrorOverlay} from '/@vite/client.js';
    document.body.appendChild(new ErrorOverlay(${JSON.stringify(
      error,
      Object.getOwnPropertyNames(error)
    ).replace(/</g, '\\u003c')}));
</script>`
}
