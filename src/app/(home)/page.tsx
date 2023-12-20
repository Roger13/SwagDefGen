'use client'

import CodeEditor from '@uiw/react-textarea-code-editor'
import JsonView from '@uiw/react-json-view'
import '@uiw/react-textarea-code-editor/dist.css'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormEvent, useState } from 'react'
import checkJson from '@/lib/utils/checkJson'
import { jsonToSwagger } from '@/lib/utils/jsonToSwagger'
import { ConvertNullToType } from '@/@types/convertNullToType'

export default function Home() {
  const [convertNullToType, setConvertNullToType]
    = useState<ConvertNullToType>('boolean')
  const [inputValue, setInputValue] = useState<string>('')
  const [outputValue, setOutputValue] = useState<string>('')
  const [addExamples, setAddExamples] = useState(false)
  const [integerToNumber, setIntegerToNumber] = useState(false)
  const [outputYalm, setOutputYalm] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const inputJson = checkJson(inputValue)
    
    if (inputJson) {
      const output = jsonToSwagger(inputJson, convertNullToType, addExamples, integerToNumber)
      setOutputValue(JSON.parse(output))
    }
  }
  
  return (
    <main className='flex justify-center items-center w-full'>
      <section className='w-full max-w-7xl p-6'>
        <header className='space-y-3 mb-6'>
          <h1 className='font-semibold text-3xl'>
            Swagger Objects Generator
          </h1>
          <p className='text-lg'>
            Add your JSON mock to generate Swagger definition objects.
          </p>
        </header>
        <form onSubmit={handleSubmit}>
          <div className='flex gap-6 my-6 space-y-2'>
            <div className='flex items-center gap-3'>
              <label className='whitespace-nowrap'>Convert null values to:</label>
              <Select onValueChange={(value: ConvertNullToType) => setConvertNullToType(value)}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder='Boolean' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Types</SelectLabel>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="integer">Integer</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='space-x-2'>
              <Checkbox
                id='add-examples'
                checked={addExamples}
                onCheckedChange={() => setAddExamples(!addExamples)}
              />
              <label htmlFor='add-examples'>
                Add values as examples
              </label>
            </div>
            <div className='space-x-2'>
              <Checkbox
                id='integer-to-number'
                checked={integerToNumber}
                onCheckedChange={() => setIntegerToNumber(!integerToNumber)}
              />
              <label htmlFor='integer-to-number'>
                Convert integer values to number
              </label>
            </div>
            <div className='space-x-2'>
              <Checkbox
                id='output-yaml'
                checked={outputYalm}
                onCheckedChange={() => setOutputYalm(!outputYalm)}
              />
              <label htmlFor='output-yalm'>
                Output as YAML
              </label>
            </div>
          </div>
          <div className='flex gap-6'>
            <div className='w-full' data-color-mode="light">
              <h3 className='mb-2'>Input:</h3>
              <CodeEditor
                style={{
                  height: 600,
                  background: 'none',
                  color: 'black',
                  border: '1px solid #ccc',
                  borderRadius: '0.5rem',
                }}
                placeholder="Please enter JSON code."
                value={inputValue}
                language='json'
                onChange={(e) => setInputValue(e.target.value)}
                className='resize-none'
                rows={30}
              />
            </div>
            <div className='w-full'>
              <h3 className='mb-2'>Output:</h3>
              <JsonView
                
                enableClipboard={false}
                displayDataTypes={false}
                displayObjectSize={false}
                typeof=''
                value={Object(outputValue)}
                className='resize-none'
                style={{
                  height: 600,
                  overflow: 'scroll',
                  background: 'none',
                  color: 'black',
                  border: '1px solid #ccc',
                  borderRadius: '0.5rem',
                }}
              />
            </div>
          </div>
          <div className='flex my-6 w-full justify-end items-center'>
            <Button>Convert</Button>
          </div>
        </form>
      </section>
    </main>
  )
}
