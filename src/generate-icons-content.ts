import * as path from 'node:path'
import * as fs from 'node:fs'
import { addTemplate, addTypeTemplate } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { IconMetadata, IconModuleOptions } from './types'
import { generateSpriteContent } from './core/sprite/generate-content'
import { generateIconsTypesContent } from './core/sprite/generate-types'

export async function generateIconsContent(nuxt: Nuxt, options: IconModuleOptions) {
  const iconsPath = path.resolve(nuxt.options.srcDir, options.iconsDir)

  const icons: IconMetadata[] = []

  // Recursive find of svg files
  async function findSVGFiles(dir: string) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        await findSVGFiles(fullPath)
      }
      else if (entry.isFile() && entry.name.endsWith('.svg')) {
        const relativePath = path.relative(iconsPath, fullPath)
        const group = path.dirname(relativePath) !== '.' ? path.dirname(relativePath) : undefined
        const name = path.basename(entry.name, '.svg')

        const svgContent = await fs.promises.readFile(fullPath, 'utf8')
        const viewBox = svgContent.match(/viewBox="([^"]+)"/) || ['', '0 0 16 16']

        icons.push({
          name,
          group,
          content: svgContent,
          viewBox: viewBox[1],
          path: fullPath,
        })
      }
    }
  }

  await findSVGFiles(iconsPath)

  // Types generation

  const typesContent = generateIconsTypesContent(icons)
  addTypeTemplate({
    filename: 'nuxt-icon-manager/icons.d.ts',
    getContents: () => typesContent,
    write: true,
  })

  // Sprite generation

  const spriteContent = generateSpriteContent(icons)

  addTemplate({
    filename: 'nuxt-icon-manager/icons-sprite.svg',
    getContents: () => spriteContent,
    write: true,
  })

  console.log('[nuxt-icon-manager] SVG sprites and types generated.')
}
