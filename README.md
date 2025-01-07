# Nuxt Icon Manager 🎨

A Nuxt.js module to manage and generate an SVG sprite from your icons. It automatically processes SVG files from a
specified directory and generates a single SVG sprite file that can be used across your project. Additionally, it
includes TypeScript support to manage icon names and types. 🚀

## Features ✨

- Automatically generates an SVG sprite from a set of SVG files. 🖼️
- TypeScript support for icon name types. 💻
- Supports SVG validation with configurable rules. ✅
- Easy integration into Nuxt.js projects. ⚡
- Lightweight and fast, ideal for optimizing SVG usage in Nuxt apps. ⚙️

## Installation 🛠️

### 1. Install the module

Add the `nuxt-icon-manager` module to your Nuxt 3 project using npm, yarn, or pnpm:

```bash
# Using npm
npm install nuxt-icon-manager

# Using yarn
yarn add nuxt-icon-manager

# Using pnpm
pnpm add nuxt-icon-manager
```

### 2. Add the module to your nuxt.config.ts file

```typescript
export default defineNuxtConfig({
  modules: [
    'nuxt-icon-manager',
  ],
  iconManager: {
    iconsDir: 'assets/icons',  // Directory with your SVG icons (assets/icons by default)
    componentName: 'VIcon' // Name of Icon component (VIcon by default)
  },
})
```

## Usage 🎨

After the module is installed and configured, you can start using the generated SVG sprite and TypeScript types in your
project.

### Using Icons with the Icon Component

You can use the Icon component to render SVG icons. It accepts the name props. 

```vue
<VIcon name="chevron-right" />
<VIcon name="socials-telegram" />
```
### Accessing Types

```typescript
import { IconNames } from '#icons'

const iconName: IconNames = 'chevron-right' // Type-safe usage of icon names

```

### Folder Structure 📁

You can organize your SVG icons in a nested folder structure. The module will automatically use the folder names as part of the icon name.

#### Example Structure:

```markdown
assets/icons/
  ├── socials/
  │    ├── tg.svg
  │    └── fb.svg
  └── ui/
       ├── arrow.svg
       └── check.svg
```
#### Generated Icon names:
```vue
<VIcon name="socials-tg" />
<VIcon name="socials-fb" />
<VIcon name="ui-arrow" />
<VIcon name="ui-check" />
```

#### Manual use

You can use SVG icons manually by referencing them via the `<use>` element in your templates:

```html
<svg>
  <use href="#icon-socials-tg"></use>
</svg>
```


## Contributing 🤝
Contributions are welcome! Please submit an issue or a pull request on GitHub if you have suggestions or improvements.

---

## License 📜
This plugin is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
