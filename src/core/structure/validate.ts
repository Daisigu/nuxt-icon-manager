import fs from 'node:fs'
import { findSVGFiles } from './find-svg-files'

export async function validateStructure(iconsPath: string) {
  if (fs.existsSync(iconsPath)) {
    try {
      const icons = await findSVGFiles(iconsPath)

      if (icons.length > 0) {
        console.log(`[nuxt-icon-manager] Found ${icons.length} SVG files in ${iconsPath}. Proceeding with sprite generation.`)
      }
    }
    catch (error) {
      throw new Error(`[nuxt-icon-manager] Error while scanning ${iconsPath}: ${error instanceof Error ? error.message : error}`)
    }
  }
  else {
    throw new Error(`[nuxt-icon-manager] Directory ${iconsPath} does not exist. Skipping sprite generation.`)
  }
}
