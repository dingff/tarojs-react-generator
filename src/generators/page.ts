import * as fs from 'fs'
import * as path from 'path'
import { parse } from '@babel/parser'
import generator from '@babel/generator'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { pageTplMap } from './template'
import { upperFirst, getCssModuleExt, createByEjs } from '../utils'

interface IProps {
  cssExt: string;
  pagePath: string;
  appPath: string;
  chalk: any;
  cssModules: boolean;
  typescript: boolean;
  hooks: boolean;
  updateRouter: {
    enable: boolean;
    space: number;
  };
  createConfigFile: boolean;
  pageTpl: string;
  configTpl: string;
  styleTpl: string;
}
export function pageGenerator({
  cssExt,
  pagePath,
  appPath,
  chalk,
  cssModules,
  typescript,
  hooks,
  updateRouter,
  createConfigFile,
  pageTpl,
  configTpl,
  styleTpl,
}: IProps) {
  const jsExt = typescript ? 'tsx' : 'jsx'
  const configExt = typescript ? 'ts' : 'js'
  const pageName = pagePath.split('/').pop() ?? ''
  const outputDir = path.join(appPath, 'src', 'pages', pagePath)
  if (fs.existsSync(outputDir)) {
    return console.log(chalk.red('页面已存在'))
  }
  fs.mkdirSync(outputDir, { recursive: true })
  const configStr = getConfigStr({
    configTpl,
    name: pageName,
    chalk,
    appPath,
    createConfigFile,
  })
  const pageStr = getPageStr({
    pageTpl,
    appPath,
    name: pageName,
    cssExt,
    cssModules,
    hooks,
    chalk,
    configStr,
    createConfigFile,
  })
  const styleStr = getStyleStr({
    styleTpl,
    appPath,
    name: pageName,
    chalk,
  })
  if (!configStr || !pageStr || !styleStr) return
  // 页面
  fs.writeFile(
    path.join(outputDir, `index.${jsExt}`),
    pageStr,
    writeFileErrorHandler,
  )
  console.log(chalk.black(`创建文件：${path.join(outputDir, `index.${jsExt}`)}`))
  // 样式
  fs.writeFile(
    path.join(outputDir, `index${getCssModuleExt(cssModules)}.${cssExt}`),
    styleStr,
    writeFileErrorHandler,
  )
  console.log(chalk.black(`创建文件：${path.join(outputDir, `index${getCssModuleExt(cssModules)}.${cssExt}`)}`))
  // 配置
  if (createConfigFile !== false) {
    fs.writeFile(
      path.join(outputDir, `index.config.${configExt}`),
      configStr,
      writeFileErrorHandler,
    )
    console.log(chalk.black(`创建文件：${path.join(outputDir, `index.config.${configExt}`)}`))
  }
  // 更新路由
  updateRouterList(appPath, `pages/${pagePath}/index`, updateRouter, configExt)
  console.log(chalk.green(`页面「${pageName}」创建成功${updateRouter.enable === false ? '' : '，路由已更新'}`))
}
function getPageStr({
  pageTpl,
  appPath,
  name,
  cssExt,
  cssModules,
  hooks,
  chalk,
  configStr,
  createConfigFile,
}: any) {
  let str = ''
  if (pageTpl) {
    str = createByEjs(path.join(appPath, pageTpl), {
      name,
    }, chalk.red('读取页面模板失败，请检查路径或文件是否正确'))
  } else {
    str = pageTplMap[hooks ? 'hooks' : 'class']({ name, cssExt, cssModules, configStr, createConfigFile })
  }
  return str
}

function getStyleStr({
  styleTpl,
  appPath,
  name,
  chalk,
}: any) {
  let str = ''
  if (styleTpl) {
    str = createByEjs(path.join(appPath, styleTpl), {
      name,
      isPage: true,
    }, chalk.red('读取样式模板失败，请检查路径或文件是否正确'))
  } else {
    str = `.${name}Page {
  
}
`
  }
  return str
}

function getConfigStr({
  configTpl,
  name,
  chalk,
  appPath,
  createConfigFile,
}: any) {
  let str = ''
  if (configTpl) {
    str = createByEjs(path.join(appPath, configTpl), {
      name,
    }, chalk.red('读取配置模板失败，请检查路径或文件是否正确'))
  } else {
    str = `${createConfigFile === false ? `
` : 'export default '}definePageConfig({
  navigationBarTitleText: '${upperFirst(name)}'
})
`
  }
  return str
}

function writeFileErrorHandler(err: any) {
  if (err) throw err
}

function updateRouterList(
  appPath: string,
  page: string,
  updateRouter: { enable: boolean, space: number },
  configExt: string,
) {
  if (updateRouter.enable === false) return
  const spaces = Array(updateRouter.space || 4).fill(' ').join('')
  const configPath = path.join(appPath, `src/app.config.${configExt}`)
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) throw (err)
    const ast = parse(data, {
      sourceType: 'module',
    })
    traverse(ast, {
      ArrayExpression(astPath: any) {
        if (astPath.parent.key.name === 'pages') {
          astPath.node.elements = astPath.node.elements.filter((item: any) => item.value !== page)
          astPath.node.elements.forEach((item: any) => {
            item.extra.raw = `\n${spaces}'${item.extra.rawValue}'`
          })
          const newEle = t.stringLiteral(page)
          newEle.extra = {
            rawValue: page,
            raw: `\n${spaces}'${page}'\n`,
          }
          astPath.node.elements.push(newEle)
        }
      },
    })
    const newFile = generator(ast)
    fs.writeFileSync(configPath, newFile.code)
  })
}
