# xipher

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

xipher is a simple wrapper around the subtle crypto API.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 434 163">
  <rect width="434" height="163" fill="#dead38"/>
  <path d="M157.33491,105.32062l-29.15144-15.7248L100,104.71594V89.59582l14.394-7.60313L100,74.38957V59.26945l28.18348,15.12012,29.15144-15.72481V73.871l-15.12,8.12168,15.12,8.12168Z" transform="translate(0.20893 -0.43215)" fill="#131313"/>
  <path d="M169.16953,98.96V77.35988h-5.70234l1.72793-12.52783h24.88359V98.96Zm-1.46894-36.936V50h22.37812V62.02394Z" transform="translate(0.20893 -0.43215)" fill="#131313"/>
  <path d="M196.12559,113.35988V64.83205h18.14414l.95039,2.23193c6.98811-4.53836,20.118-3.6762,25.79006,1.15188q5.05456,4.10446,5.05486,13.248c.43945,16.64766-15.33159,20.71242-29.03086,16.91992v14.97607Zm24.5373-26.13574A3.7695,3.7695,0,0,0,223.64414,86c1.38055-1.20861,1.49719-7.29008-.00008-8.42383-1.64447-1.50487-4.79929-1.23919-6.60988.07178v8.49609A6.20563,6.20563,0,0,0,220.66289,87.22414Z" transform="translate(0.20893 -0.43215)" fill="#131313"/>
  <path d="M274.14375,99.68019c-11.53091.10644-25.508-4.49635-25.48779-17.64019a16.16288,16.16288,0,0,1,5.83193-13.03217c6.91041-6.43189,26.57789-6.42525,34.25741-.57546,6.80134,4.69219,6.41179,10.58825,6.30763,18.14382H267.75059c5.175,4.54045,18.86917,2.89652,25.22871,1.15186v9.35986Q286.49912,99.68,274.14375,99.68019Zm-6.39316-21.8164h9.41719c.15985-2.52352-1.65608-3.51377-4.57906-3.45551C269.80425,74.38756,267.87861,75.34421,267.75059,77.86379Z" transform="translate(0.20893 -0.43215)" fill="#131313"/>
  <path d="M299.37188,98.96V64.83205h20.47676l.43183,1.94385a36.15479,36.15479,0,0,1,13.565-2.66407V76.92775c-3.69449.00592-10.17684.40073-13.565,1.44043V98.96Z" transform="translate(0.20893 -0.43215)" fill="#131313"/>
</svg>

## Security Considerations

You have read this section already pretty much everywhere.

Security is not a thing that is either there or not, it's a process.

<p align="center">
  <img src="https://imgs.xkcd.com/comics/security.png" alt="Security" width="400" />
</p>

Ultimately, there is no algorithm to determine whether an encryption is secure, there is just a bunch of very smart folks trying to break it.
Sure some pattern of attack emerges, but still, there is no life-equation that determines whether a algorithm is secure or not.
As you might have already guess, if there is no algorithm to determine whether an encryption standard is secure, there is no algorithm to determine whether your specific implementation is secure.

<p align="center">
  <img src="https://imgs.xkcd.com/comics/security_holes.png" alt="Security Holes" width="400" />
</p>

So here's the rule, the word "secure" have no meaning, secure from what? secure when? secure how?
Whiteout addressing those questions, the word "secure" is just a buzzword.

Ok then, what should you do?

This library uses the Web Crypto API, which is a well-tested and secure API.
Certain functionality are just wrappers around that API, others are implemented by gluing together those functionalities.

## License

[MIT](./LICENSE)

[npm-version-src]: https://img.shields.io/npm/v/xipher?style=flat&colorA=1c1c1c&colorB=dead38
[npm-version-href]: https://npmjs.com/package/xipher
[npm-downloads-src]: https://img.shields.io/npm/dm/xipher?style=flat&colorA=1c1c1c&colorB=dead38
[npm-downloads-href]: https://npmjs.com/package/xipher
[bundle-src]: https://img.shields.io/bundlephobia/minzip/xipher?style=flat&colorA=1c1c1c&colorB=dead38
[bundle-href]: https://bundlephobia.com/result?p=xipher
[license-src]: https://img.shields.io/github/license/lucacicada/xipher.svg?style=flat&colorA=1c1c1c&colorB=dead38
[license-href]: https://github.com/lucacicada/xipher/blob/main/LICENSE
