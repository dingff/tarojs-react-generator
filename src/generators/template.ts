import { upperFirst, getCssModuleClassName, getCssImport, lowerFirst } from '../utils'

export const pageTplMap = {
  class: ({ name, cssExt, cssModules, configStr, createConfigFile }:any) => `import { Component } from 'react'
import { View } from '@tarojs/components'
${getCssImport(cssModules, cssExt)}
${createConfigFile === false ? configStr : ''}
class ${upperFirst(name)} extends Component {

  render() {
    return (
      <View className=${getCssModuleClassName(`${name}Page`, cssModules)}>
        ${upperFirst(name)}
      </View>
    )
  }
}

export default ${upperFirst(name)}
`,
  hooks: ({ name, cssExt, cssModules, configStr, createConfigFile }:any) => `import { useEffect } from 'react'
import { View } from '@tarojs/components'
${getCssImport(cssModules, cssExt)}
${createConfigFile === false ? configStr : ''}
function ${upperFirst(name)}() {

  return (
    <View className=${getCssModuleClassName(`${name}Page`, cssModules)}>
      ${upperFirst(name)}
    </View>
  )
}

export default ${upperFirst(name)}
`,
}
export const componentTplMap = {
  class: ({ name, cssExt, cssModules }:any) => `import { Component } from 'react'
import { View } from '@tarojs/components'
${getCssImport(cssModules, cssExt)}

class ${name} extends Component {

  render() {
    return (
      <View className=${getCssModuleClassName(`${lowerFirst(name)}Com`, cssModules)}>
        ${name}
      </View>
    )
  }
}

export default ${name}
`,
  hooks: ({ name, cssExt, cssModules, typescript }:any) => `import { View } from '@tarojs/components'
${getCssImport(cssModules, cssExt)}
${typescript ? `
interface IProps {
}
` : ''}
function ${name}() {
  return (
    <View className=${getCssModuleClassName(`${lowerFirst(name)}Com`, cssModules)}>
      ${name}
    </View>
  )
}

export default ${name}
`,
}
