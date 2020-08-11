const GTM_ID = 'UA-175196568-1';

export default () => {
  if (process.env.NODE_ENV !== 'production') return
  console.info('Initializing Google Analytics')

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${ GTM_ID }`;
  document.body.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GTM_ID, { 'anonymize_ip': true });
}
