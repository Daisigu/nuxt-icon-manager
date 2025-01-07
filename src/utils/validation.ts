import * as fs from 'node:fs'
import { DOMParser } from '@xmldom/xmldom'

export async function validateSVG(filePath: string, rules: { maxSize?: number, allowedElements?: string[] } = {}) {
  const errors: string[] = []
  const content = await fs.promises.readFile(filePath, 'utf8')

  if (rules.maxSize) {
    const stats = await fs.promises.stat(filePath)
    const sizeInKB = stats.size / 1024
    if (sizeInKB > rules.maxSize) {
      errors.push(`File size exceeds ${rules.maxSize}KB`)
    }
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'image/svg+xml')

  if (rules.allowedElements) {
    const elements = doc.getElementsByTagName('*')
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      if (!rules.allowedElements.includes(element.nodeName)) {
        errors.push(`Element <${element.nodeName}> is not allowed`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
