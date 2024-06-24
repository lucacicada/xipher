import { describe, expect, it } from 'vitest'
import { pbkdf2, sha256 } from '../src'

describe('pbkdf2', () => {
  it('should return an ArrayBuffer instance', async () => {
    await expect(pbkdf2('password')).resolves.toBeInstanceOf(ArrayBuffer)
  })

  it('should compute the default length 16', async () => {
    await expect(pbkdf2('password')).resolves.toHaveProperty('byteLength', 16)
  })

  it('should compute the default length 16 when either null or undefined is used as a second parameter', async () => {
    await expect(pbkdf2('password', null as unknown as any)).resolves.toHaveProperty('byteLength', 16)
    await expect(pbkdf2('password', undefined)).resolves.toHaveProperty('byteLength', 16)
  })

  it.each([16, 32, 34, 164, 380])('should compute the expected length %i', async (keyLength) => {
    await expect(pbkdf2('password', keyLength)).resolves.toHaveProperty('byteLength', keyLength)
  })

  it.each([
    ['sha-256', 32],
    ['SHA-256', 32],
    ['SHA-1', 20],
    ['SHA-512', 64],
    ['sha-512', 64],
  ])('should compute the expected length "%s" (%i bytes)', async (alg, keyLength) => {
    await expect(pbkdf2('password', alg)).resolves.toHaveProperty('byteLength', keyLength)
  })
})

describe('sha-256', () => {
  it('should encode a string', async () => {
    await expect(sha256('')).resolves.toBeTypeOf('string')
  })

  it('should encode an ArrayBuffer', async () => {
    await expect(sha256('', 'raw')).resolves.toBeInstanceOf(ArrayBuffer)
  })

  it('should encode a string when the encoder is either null or undefined', async () => {
    await expect(sha256('', null as unknown as any)).resolves.toBeTypeOf('string')
    await expect(sha256('', undefined)).resolves.toBeTypeOf('string')
  })
})
