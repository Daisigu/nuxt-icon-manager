import * as path from 'node:path'
import * as fs from 'node:fs'
import { addTemplate, addTypeTemplate } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { IconMetadata, IconModuleOptions } from './types'

export async function generateSprite(nuxt: Nuxt, options: IconModuleOptions) {
  const iconsPath = path.resolve(nuxt.options.srcDir, options.iconsDir)

  const icons: IconMetadata[] = []

  /* Recursive find of svg files */
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
          viewBox: viewBox[1],
          path: fullPath,
        })
      }
    }
  }

  await findSVGFiles(iconsPath)

  /* Sprite generation */
  let svgContent = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">\n'

  for (const icon of icons) {
    const svgData = await fs.promises.readFile(icon.path, 'utf8')
    const cleanSvgData = svgData
      .replace(/<\?xml.*?\?>/g, '')
      .replace(/<!DOCTYPE.*?>/g, '')
      .replace(/<svg[^>]*>/g, '')
      .replace(/<\/svg>/g, '')
    /*    .replace(/\s(width|height)="[^"]*"/g, '') */

    const iconId = icon.group ? `${icon.group}-${icon.name}` : icon.name
    const symbol = `<symbol id="icon-${iconId}" viewBox="${icon.viewBox}">${cleanSvgData}</symbol>`
    svgContent += symbol + '\n'
  }

  svgContent += '</svg>'

  // Types generation
  const iconNames = icons.map(icon =>
    icon.group ? `'${icon.group}-${icon.name}'` : `'${icon.name}'`,
  ).join(' | ')

  const typeContent = `declare module '#icons' {
          export type IconNames = ${iconNames}
        }`

  addTypeTemplate({
    filename: 'nuxt-icon-manager/icons.d.ts',
    getContents: () => typeContent,
    write: true,
  })

  addTemplate({
    filename: 'nuxt-icon-manager/icons-sprite.svg',
    getContents: () => svgContent,
    write: true,
  })
  console.log('[nuxt-icon-manager] SVG sprites and types generated.')
  const regenerate = async () => {
    await generateSprite(nuxt, options)
  }

  return {
    regenerate,
  }
}
