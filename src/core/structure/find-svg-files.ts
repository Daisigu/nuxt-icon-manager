import fs from 'node:fs'
import path from 'node:path'
import type { IconMetadata } from '~/src/types'

export const findSVGFiles = async (dir: string, baseDir?: string): Promise<IconMetadata[]> => {
  const icons: IconMetadata[] = []
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      const nestedIcons = await findSVGFiles(fullPath, baseDir || dir)
      icons.push(...nestedIcons)
    }
    else if (entry.isFile() && entry.name.endsWith('.svg')) {
      const relativePath = path.relative(baseDir || dir, fullPath)
      const name = path.basename(entry.name, '.svg')
      const dirName = path.dirname(relativePath)
      const group = dirName !== '.' ? dirName.split(path.sep).join('-') : undefined
      const iconName = group ? `${group}-${name}` : name
      const svgContent = await fs.promises.readFile(fullPath, 'utf8')
      const viewBox = svgContent.match(/viewBox="([^"]+)"/) || ['', '0 0 16 16']

      icons.push({
        name: iconName,
        group,
        content: svgContent,
        viewBox: viewBox[1],
        path: fullPath,
      })
    }
  }
  return icons
}
