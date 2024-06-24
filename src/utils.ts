import {
  base64urlDecode,
  base64urlEncode,
  bufferToString,
  stringToBuffer,
} from 'iron-webcrypto'

export {
  base64urlDecode,
  base64urlEncode,
  bufferToString,
  stringToBuffer,
}

function hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export type Encoding = 'raw' | 'hex' | 'HEX' | 'base64url'

interface Encoded {
  raw: ArrayBuffer
  hex: string
  HEX: string
  base64url: string
}

export type Encode<T> = T extends Encoding ? Encoded[T] : ArrayBuffer

/**
 * Encode an `ArrayBuffer` with the given encoder.
 */
export function encodeArrayBuffer<const T extends Encoding>(buffer: ArrayBuffer, encoder: T): Encode<T> {
  switch (encoder) {
    case 'hex': return hex(buffer) as Encode<T>
    case 'HEX': return hex(buffer).toUpperCase() as Encode<T>
    case 'base64url': return base64urlEncode(new Uint8Array(buffer)) as Encode<T>
  }

  return buffer as Encode<T>
}

const keyLengths: Record<string, number> = {
  'SHA-1': 20,
  // 'SHA-256': 32,
  'SHA-384': 48,
  'SHA-512': 64,

  'RSA-OAEP': 256,
  'RSA-PSS': 256,
  'RSA-ES': 256,
}

export function klen(alg: HashAlgorithmIdentifier): number {
  const name = (typeof alg === 'string' ? alg : alg.name).toUpperCase()
  return keyLengths[name] ?? 32
}

/**
 * Implements a constant-time comparison algorithm.
 *
 * @param a Original string (running time is always proportional to its length)
 * @param b String to compare to original string
 * @returns Returns true if `a` is equal to `b`, without leaking timing information
 *          that would allow an attacker to guess one of the values.
 */
export function fixedTimeComparison(a: string, b: string): boolean {
  let mismatch = a.length === b.length ? 0 : 1

  if (mismatch) {
    b = a
  }

  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return mismatch === 0
}
