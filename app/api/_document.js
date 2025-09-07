// pages/_document.js
// Custom Document to include Cashfree JS SDK

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Cashfree Drop-in JS SDK */}
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js" async></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
