import type { PluginConfig } from 'svgo'

export interface IconModuleOptions {
  iconsDir: string
  componentName: string
  optimization?: {
    enabled: boolean
    svgo?: {
      multipass: boolean
      plugins: string[]
    }
  }
  validation?: {
    enabled: boolean
    rules?: {
      maxSize?: number
      allowedElements?: string[]
    }
  }
}

export interface SVGOConfig {
  multipass: boolean
  plugins: PluginConfig[]
}

export interface ValidationRules {
  maxSize?: number
  allowedElements?: string[]
  disallowedElements?: string[]
}

export interface IconMetadata {
  name: string
  group?: string
  viewBox: string
  path: string
}
