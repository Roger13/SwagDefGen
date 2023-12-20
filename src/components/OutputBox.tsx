import CodeEditor from '@uiw/react-textarea-code-editor'
import JsonView from '@uiw/react-json-view'
import { styleBox } from '@/lib/utils/styleBox'

interface OutputBoxProps {
  outputYaml: boolean
  outputValue: string
}

export default function OutputBox({ outputYaml, outputValue }: OutputBoxProps) {
  return (
    <div className='w-full'>
      <h3 className='mb-2'>Output:</h3>
      {outputYaml
        ? (<CodeEditor
          style={styleBox}
          value={outputValue}
          language='yaml'
          className='resize-none'
        />)
        : (<JsonView
          enableClipboard={false}
          displayDataTypes={false}
          displayObjectSize={false}
          typeof=''
          value={Object(outputValue)}
          className='resize-none'
          style={styleBox}
        />)
      }
    </div>
  )
}