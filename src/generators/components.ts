import * as fs from 'fs'
import * as path from 'path'
import {
  upperFirst,
  lowerFirst,
  getCssModuleExt,
  createByEjs,
} from '../utils'
import { componentTplMap } from './template'

const getComStr = ({
  componentTpl,
  appPath,
  name,
  cssExt,
  cssModules,
  hooks,
  chalk,
  typescript,
}: any) => {
  let str = ''
  if (componentTpl) {
    str = createByEjs(path.join(appPath, componentTpl), {
      name,
    }, chalk.red('读取组件模板失败，请检查路径或文件是否正确'))
  } else {
    str = componentTplMap[hooks ? 'hooks' : 'class']({ name, cssExt, cssModules, typescript })
  }
  return str
}

const getStyleStr = ({
  styleTpl,
  appPath,
  name,
  chalk,
}: any) => {
  let str = ''
  if (styleTpl) {
    str = createByEjs(path.join(appPath, styleTpl), {
      name,
      isPage: false,
    }, chalk.red('读取样式模板失败，请检查路径或文件是否正确'))
  } else {
    str = `.${lowerFirst(name)}Com {
  
}
`
  }
  return str
}

function writeFileErrorHandler(err:any) {
  if (err) throw err
}
interface P {
  cssExt: string;
  componentPath: string;
  appPath: string;
  chalk: any;
  cssModules: boolean;
  typescript: boolean;
  hooks: boolean;
  componentTpl: string;
  styleTpl: string;
}
export function componentGenerator({
  cssModules,
  componentPath,
  appPath,
  chalk,
  cssExt,
  typescript,
  hooks,
  componentTpl,
  styleTpl,
}: P) {
  const jsExt = typescript ? 'tsx' : 'jsx'
  const pathArr = componentPath.split('/')
  const componentName = upperFirst(pathArr.pop() ?? '')
  const pagePath = pathArr.join('/')
  if (pagePath) {
    // 检测页面是否存在
    const pageDir = path.join(appPath, 'src', 'pages', pagePath)
    if (!fs.existsSync(pageDir)) {
      return console.log(chalk.red(`页面目录【${pageDir}】不存在，无法创建组件`))
    }
  }
  const outputDir = path.join(
    appPath,
    'src',
    pagePath ? 'pages' : '',
    pagePath || '',
    'components',
    componentName,
  )
  if (fs.existsSync(outputDir)) {
    return console.log(chalk.red('组件已存在'))
  }
  fs.mkdirSync(outputDir, { recursive: true })
  const comStr = getComStr({
    componentTpl,
    appPath,
    name: componentName,
    cssExt,
    cssModules,
    hooks,
    chalk,
    typescript,
  })
  const styleStr = getStyleStr({
    styleTpl,
    appPath,
    name: componentName,
    chalk,
  })
  if (!comStr || !styleStr) return
  // 页面
  fs.writeFile(
    path.join(outputDir, `index.${jsExt}`),
    comStr,
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
  console.log(chalk.green(`组件「${componentName}」创建成功`))
}
