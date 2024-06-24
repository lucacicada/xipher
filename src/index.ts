import crypto from 'uncrypto'
import type { Encoding } from './utils'
import { encodeArrayBuffer, fixedTimeComparison, klen, stringToBuffer } from './utils'

export type Password = BufferSource | Uint8Array | string

// Pbkdf2Params is used in the `lib.dom.d.ts` types.
export interface Pbkdf2Options {
  /**
   * @default 'SHA-1'
   */
  hash?: HashAlgorithmIdentifier

  /**
   * @default 1
   */
  iterations?: number

  /**
   * @default '' (empty string)
   */
  salt?: BufferSource | Uint8Array | string
}

/**
 * Compute the `PBKDF2` hash of the given password.
 *
 * Default:
 * - key length is `16` bytes.
 * - hash is `SHA-1`.
 * - iterations is `1`.
 * - salt is an empty string.
 *
 * ### Example
 *
 * ```ts
 * const key = await pbkdf2('password', 32)
 * const key = await pbkdf2('password', 'SHA-256') // SHA-256 key size is 32 bytes
 * const key = await pbkdf2('password', 32, { salt: 'custom-salt' })
 * const key = await pbkdf2('password', 32, { hash: 'SHA-256' }) // use SHA-256 instead of SHA-1
 * ```
 */
export async function pbkdf2(password: Password, keyLength: number | string = 16, params?: Pbkdf2Options): Promise<ArrayBuffer> {
  const passwordBuffer = typeof password === 'string' ? stringToBuffer(password) : password

  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    {
      name: 'PBKDF2',
    },
    false,
    [
      'deriveBits',
    ],
  )

  const saltBuffer = params?.salt
    ? (
        typeof params.salt === 'string' ? stringToBuffer(params.salt) : params.salt
      )
    : new Uint8Array([0])

  const length = 8 * (keyLength == null
    // Treat undefined and null as 16 bytes.
    ? 16
    : (
        // When a string is used, assume it's a hash algorithm like 'SHA-256'.
        typeof keyLength === 'string' ? klen(keyLength) : keyLength
      )
  )

  const derivation = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      hash: params?.hash || 'SHA-1',
      iterations: params?.iterations || 1,
    },
    importedKey,
    length,
  )

  return derivation
}

export type DigestData = BufferSource | Uint8Array | string

/**
 * > From https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 *
 * The `digest()` method of the {@link SubtleCrypto} interface generates a digest of the given data.
 *
 * ### Example
 *
 * ```ts
 * const hash = await digest('SHA-256', 'abc')
 * const hash = await digest('SHA-256', 'abc', 'hex')
 * ```
 */
export async function digest<const T extends Encoding = 'raw'>(alg: AlgorithmIdentifier, data: DigestData, encoder: T = 'raw' as T) {
  return encodeArrayBuffer(
    await crypto.subtle.digest(alg, typeof data === 'string' ? stringToBuffer(data) : data),
    encoder,
  )
}

/**
 * Compute the `HMAC` hash of the given data.
 */
export async function hmac<const T extends Encoding = 'hex'>(alg: HashAlgorithmIdentifier, data: string, password: Password, encoder: T = 'hex' as T) {
  // Derive the key from a string password.
  if (typeof password === 'string') {
    password = await pbkdf2(password, klen(alg), { salt: 'hmac_hash' })
  }

  const key = await crypto.subtle.importKey(
    'raw',
    password,
    {
      name: 'HMAC',
      hash: alg,
    },
    false,
    [
      'sign',
      'verify',
    ],
  )

  return encodeArrayBuffer(
    await crypto.subtle.sign({ name: 'HMAC' }, key, typeof data === 'string' ? stringToBuffer(data) : data),
    // NOTE: ensure we are correctly using the default encoder.
    // We treat `null` and `undefined` as begin unset.
    encoder == null ? 'hex' : encoder,
  )
}

/**
 * Compute the `SHA-256` hash of the given data.
 *
 * @see {@link digest}
 */
export function sha256<const T extends Encoding = 'hex'>(data: DigestData, encoder: T = 'hex' as T) {
  return digest(
    'SHA-256',
    data,
    // NOTE: ensure we are correctly using the default encoder.
    // We treat `null` and `undefined` as begin unset.
    encoder == null ? 'hex' : encoder,
  )
}

/**
 * Compute the `SHA-256` HMAC of the given data in lowercase hex.
 */
export function sha256Hmac<const T extends Encoding = 'hex'>(data: string, password: Password, encoder: T = 'hex' as T) {
  return hmac(
    'SHA-256',
    data,
    password,
    // NOTE: hmac uses `hex` as the default encoder.
    encoder,
  )
}

/**
 * When `number` is provided, is treated as seconds from now.
 * When `Date` is provided, is treated as an absolute date.
 */
type Expiration = Date | number

function computeExpirationInUnixSeconds(expires: Expiration) {
  if (expires instanceof Date) {
    return Math.floor(expires.getTime() / 1000)
  }

  if (typeof expires === 'number') {
    return Math.floor(Date.now() / 1000) + expires
  }

  throw new TypeError('Invalid expiration type')
}

/**
 * Sign a URL. This method adds a `signature` parameter to the URL that contains the HMAC of the URL.
 *
 * The URL cannot have a `signature` nor `expires` parameter.
 *
 * ### Example
 *
 * ```ts
 * // Sign a URL.
 * const signed = await signedURL('https://example.com', 'password')
 *
 * // Sign a URL that expires in 60 seconds.
 * const signed = await signedURL('https://example.com', 'password', 60)
 * ```
 */
export async function signedURL(url: string | URL, password: Password, expires?: Expiration): Promise<string> {
  const uri = new URL(url)

  if (uri.searchParams.has('signature')) {
    throw new Error('URL already has "signature" parameter')
  }

  // NOTE: we have to check for the existence of the `expires` parameter
  // because the verify method check for this parameter to validate the expiration, if it exists.
  if (uri.searchParams.has('expires')) {
    throw new Error('URL already has "expires" parameter')
  }

  if (expires) {
    uri.searchParams.set('expires', computeExpirationInUnixSeconds(expires).toString())
  }

  uri.searchParams.sort()

  const signature = await hmac('SHA-1', uri.toString(), password, 'base64url')
  uri.searchParams.set('signature', signature)

  return uri.href
}

/**
 * Alias of {@link signedURL} except that the `expires` parameter is required.
 */
export function temporarySignedURL(url: string | URL, password: Password, expires: Expiration): Promise<string> {
  return signedURL(url, password, expires)
}

/**
 * Verify a signed URL by the `signature` parameter.
 */
export async function verifySignedURL(url: string | URL, password: Password | Password[]) {
  const uri = new URL(url)
  const signature = uri.searchParams.get('signature') || ''
  uri.searchParams.delete('signature')

  uri.searchParams.sort()

  for (const key of Array.isArray(password) ? password : [password]) {
    const expected = await hmac('SHA-1', uri.toString(), key, 'base64url')

    if (fixedTimeComparison(signature, expected)) {
      const expires = uri.searchParams.get('expires')
      return !(expires && Math.floor(Date.now() / 1000) > +expires)
    }
  }

  return false
}
