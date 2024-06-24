/// <reference types="node" />

import { createReadStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { createHash } from 'node:crypto'

export async function sha256File(filePath: string): Promise<string> {
  const input = createReadStream(filePath)
  const hash = createHash('sha256')
  await pipeline(input, hash)
  return hash.digest('hex')
}
