import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/node.ts',
    'src/utils.ts',
  ],
})
