import fs from 'node:fs/promises'
import path from 'node:path'

const distPath = path.resolve(process.cwd(), 'dist')

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const resolved = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(resolved)))
    } else if (entry.isFile()) {
      const stat = await fs.stat(resolved)
      files.push({ file: path.relative(distPath, resolved), size: stat.size })
    }
  }

  return files
}

function formatBytes(bytes) {
  return bytes < 1024
    ? `${bytes} B`
    : `${(bytes / 1024).toFixed(2)} KB`
}

async function main() {
  try {
    const stat = await fs.stat(distPath)
    if (!stat.isDirectory()) {
      console.error(`Expected dist/ to be a directory, but it is not.`)
      process.exit(1)
    }
  } catch {
    console.error('dist/ directory not found. Run `npm run build` first.')
    process.exit(1)
  }

  const files = await collectFiles(distPath)
  if (!files.length) {
    console.log('No files found in dist/. Are you using the right build output directory?')
    process.exit(0)
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  files.sort((a, b) => b.size - a.size)

  console.log('\nBundle size report for dist/')
  console.log('------------------------------------')
  console.log(`Files: ${files.length}`)
  console.log(`Total size: ${formatBytes(totalSize)}`)
  console.log('------------------------------------')
  console.log('Top files by size:')

  const top = files.slice(0, 20)
  for (const { file, size } of top) {
    console.log(`  ${formatBytes(size).padStart(8)}  ${file}`)
  }

  if (files.length > top.length) {
    console.log(`  ...and ${files.length - top.length} more files`)
  }
  console.log('')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
