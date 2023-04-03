import { componentGenerator } from './generators/components'
import { pageGenerator } from './generators/page'
import { getCssExt } from './utils'

interface optsType {
  css?: string;
  cssModules?: boolean;
  typescript?: boolean;
  hooks?: boolean;
  updateRouter?: {
    enable: boolean;
    space: number;
  };
  createConfigFile?: boolean;
  pageTpl?: string;
  configTpl?: string;
  styleTpl?: string;
  componentTpl?: string;
}
export default (ctx: any, pluginOpts: optsType) => {
  const {
    css = 'sass',
    cssModules = true,
    typescript = false,
    hooks = false,
    updateRouter = { enable: true, space: 4 },
    createConfigFile = true,
    pageTpl = '',
    configTpl = '',
    styleTpl = '',
    componentTpl = '',
  } = pluginOpts
  ctx.registerCommand({
    // 命令名
    name: 'g',
    // 执行 taro g --help 时输出的 options 信息
    optionsMap: {
      '--com': '组件',
      '--page': '页面',
    },
    // 执行 taro g --help 时输出的使用例子的信息
    synopsisList: [
      'taro g --com Button              (生成：src/components/Button/index.tsx)',
      'taro g --com index/Banner        (生成：src/pages/index/components/Banner/index.tsx)',
      'taro g --page mine               (生成：src/pages/mine/index.tsx)',
      'taro g --page mine/detailPage    (生成：src/pages/mine/detailPage/index.tsx)',
    ],
    async fn() {
      const cssExt = getCssExt(css)
      const { chalk } = ctx.helper
      const { com, page } = ctx.runOpts.options
      const { appPath } = ctx.paths
      if (com !== undefined && typeof com !== 'string') {
        return console.log(chalk.red('Usage: taro g --com <path>'))
      }
      if (page !== undefined && typeof page !== 'string') {
        return console.log(chalk.red('Usage: taro g --page <name>'))
      }
      if (typeof com === 'string') {
        return componentGenerator({
          cssModules,
          componentPath: com,
          appPath,
          cssExt,
          chalk,
          typescript,
          hooks,
          componentTpl,
          styleTpl,
        })
      }

      if (typeof page === 'string') {
        return pageGenerator({
          cssModules,
          pagePath: page,
          appPath,
          chalk,
          cssExt,
          typescript,
          hooks,
          updateRouter,
          createConfigFile,
          pageTpl,
          configTpl,
          styleTpl,
        })
      }
    },
  })
}
