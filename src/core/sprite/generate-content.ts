import type { IconMetadata } from '~/src/types'

export function generateSpriteContent(icons: IconMetadata[]): string {
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">\n'
  const footer = '</svg>'

  const symbols = icons.map((icon) => {
    const svgData = icon.content
      .replace(/<\?xml.*?\?>/g, '')
      .replace(/<!DOCTYPE.*?>/g, '')
      .replace(/<svg[^>]*>/g, '')
      .replace(/<\/svg>/g, '')

    return `<symbol id="icon-${icon.name}" viewBox="${icon.viewBox}">${svgData}</symbol>`
  }).join('\n')

  return `${header}${symbols}${footer}`
}
