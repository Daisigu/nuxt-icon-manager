import fs from 'node:fs'
import path from 'node:path'

// Validate assets structure
export function validateStructure(iconsPath: string) {
  if (fs.existsSync(iconsPath)) {
    const files = fs.readdirSync(iconsPath)

    // Filter not svg files
    const svgFiles = files.filter(file => path.extname(file).toLowerCase() === '.svg')

    if (svgFiles.length > 0) {
      console.log(`[nuxt-icon-manager] Found ${svgFiles.length} SVG files in ${iconsPath}. Proceeding with sprite generation.`)
    }
    else {
      throw new Error(`[nuxt-icon-manager] No SVG files found in ${iconsPath}. Skipping sprite generation.`)
    }
  }
  else {
    throw new Error(`[nuxt-icon-manager] Directory ${iconsPath} does not exist. Skipping sprite generation.`)
  }
}
