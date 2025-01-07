import * as path from 'node:path'
import { addTemplate, addTypeTemplate } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { IconModuleOptions } from './types'
import { generateSpriteContent } from './core/sprite/generate-content'
import { generateIconsTypesContent } from './core/sprite/generate-types'
import { findSVGFiles } from './core/structure/find-svg-files'

export async function generateIconsContent(nuxt: Nuxt, options: IconModuleOptions) {
  const iconsDirectory = path.resolve(nuxt.options.srcDir, options.iconsDir)

  // Recursive find of svg files
  const icons = await findSVGFiles(iconsDirectory)

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
