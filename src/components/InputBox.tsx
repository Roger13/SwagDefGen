import CodeEditor from '@uiw/react-textarea-code-editor'
import { styleBox } from '@/lib/utils/styleBox'
import { Dispatch } from 'react'

interface InputBoxProps {
  inputValue: string;
  setInputValue: Dispatch<React.SetStateAction<string>>
}

export default function InputBox({ inputValue, setInputValue }: InputBoxProps) {
  return (
    <div className='w-full' data-color-mode="light">
      <h3 className='mb-2'>Input:</h3>
      <CodeEditor
        style={styleBox}
        placeholder="Please enter JSON code."
        value={inputValue}
        language='json'
        onChange={(e) => setInputValue(e.target.value)}
        className='resize-none'
      />
    </div>
  )
}