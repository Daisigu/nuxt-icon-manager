import * as path from 'node:path'
import * as fs from 'node:fs'
import {
  createResolver,
  defineNuxtModule,
  addPluginTemplate,
  addComponent,
} from '@nuxt/kit'
import chokidar from 'chokidar'
import type { IconModuleOptions } from './types'
import { validateStructure } from './core/structure/validate'
import { generateIconsContent } from './generate-icons-content'
import { debounce } from './utils/debounce'

export default defineNuxtModule<IconModuleOptions>({
  meta: {
    name: 'nuxt-icon-manager',
    configKey: 'iconModule',
    version: '1.0.0',
  },
  defaults: {
    iconsDir: 'assets/icons',
    componentName: 'VIcon',
  },
  async setup(options, nuxt) {
    try {
      const { resolve } = createResolver(import.meta.url)
      const runtimeDir = resolve('./runtime')

      await validateStructure(resolve(nuxt.options.rootDir, options.iconsDir))
      await generateIconsContent(nuxt, options)

      nuxt.options.alias['#icons'] = resolve(nuxt.options.buildDir, 'nuxt-icon-manager/icons')
      nuxt.options.build.transpile.push(runtimeDir)

      const spritePath = path.join(nuxt.options.buildDir, 'nuxt-icon-manager/icons-sprite.svg')
      const spriteContent = fs.readFileSync(spritePath, 'utf8')

      addPluginTemplate({
        filename: 'icons-sprite.ts',
        write: true,
        mode: 'server',
        getContents: () => `
            import { defineNuxtPlugin } from '#app'
            export default defineNuxtPlugin((nuxtApp) => {
              const spriteContent = ${JSON.stringify(spriteContent)}

              nuxtApp.hook('app:rendered', (ctx) => {
                if (ctx.renderResult?.html) {
                  ctx.renderResult.html += spriteContent
                }
              })
            })
          `,
      })

      await addComponent({
        name: options.componentName,
        filePath: resolve(runtimeDir, 'components/VIcon.vue'),
      })

      if (nuxt.options.dev) {
        const iconsPath = resolve(nuxt.options.srcDir, options.iconsDir)
        const watcher = chokidar.watch(iconsPath, {
          ignored: /(^|[/\\])\../,
          persistent: true,
          ignoreInitial: true,
        })
        const debouncedRegenerate = debounce(() => generateIconsContent(nuxt, options), 300)
        watcher
          .on('add', async () => {
            console.log('[nuxt-icon-manager] Icon added')
            debouncedRegenerate()
          })
          .on('unlink', async () => {
            console.log('[nuxt-icon-manager] Icon removed')
            debouncedRegenerate()
          })
          .on('change', async () => {
            console.log('[nuxt-icon-manager] Icon changed')
            debouncedRegenerate()
          })
        nuxt.hook('close', () => watcher.close())
      }
    }
    catch (error: unknown) {
      console.warn('[nuxt-icon-manager]', error instanceof Error ? error.message : 'An unknown error occurred')
    }
  },
})
