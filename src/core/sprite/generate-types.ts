import type { IconMetadata } from '~/src/types'

export const generateIconsTypesContent = (icons: IconMetadata[]) => {
  const iconNames = icons.map(icon => `'${icon.name}'`).join(' | ')

  return `declare module '#icons' {
          export type IconNames = ${iconNames}
        }`
}
