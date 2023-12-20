'use client'

import { FormEvent, useEffect, useState } from 'react'

import CodeEditor from '@uiw/react-textarea-code-editor'
import JsonView from '@uiw/react-json-view'
import { Document } from 'yaml'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import checkJson from '@/lib/utils/checkJson'
import { jsonToSwagger } from '@/lib/utils/jsonToSwagger'
import { ConvertNullToType } from '@/@types/convertNullToType'

const style = {
  height: 600,
  overflow: 'scroll',
  background: 'none',
  color: 'black',
  border: '1px solid #ccc',
  borderRadius: '0.5rem',
}

export default function Home() {
  const [convertNullToType, setConvertNullToType]
    = useState<ConvertNullToType>('boolean')
  const [inputValue, setInputValue] = useState<string>('')
  const [outputValue, setOutputValue] = useState<string>('')
  const [addExamples, setAddExamples] = useState(false)
  const [integerToNumber, setIntegerToNumber] = useState(false)
  const [outputYaml, setOutputYaml] = useState(false)

  useEffect(() => {
    if (outputYaml) {
      outputInYaml()
    } else {
      outputInJson()
    }
  }, [addExamples, integerToNumber, outputYaml])

  function checkInputFormat() {
    const check = checkJson(inputValue)
    if (check && inputValue.length > 0) {
      return true
    }
    return false
  }

  function handleSubmit(event?: FormEvent) {
    event?.preventDefault()
    
    if (outputYaml) {
      outputInYaml()
    } else {
      outputInJson()
    }
  }

  function outputInYaml() {
    if (!checkInputFormat()) return
    const json = JSON.parse(inputValue)
    const output = JSON.parse(
      jsonToSwagger(json, convertNullToType, addExamples, integerToNumber)
    )
    const doc = new Document()
    doc.contents = output
    setOutputValue(doc.toString())
  }

  function outputInJson() {
    if (!checkInputFormat()) return
    const json = JSON.parse(inputValue)
    const output = jsonToSwagger(
      json, convertNullToType, addExamples, integerToNumber
    )
    setOutputValue(JSON.parse(output))
  }

  function handleOutputYalmConvert() {
    setOutputYaml((state) => {
      const updateValue = !state
      return updateValue
    })
  }

  function handleAddValuesAsExamples() {
    setAddExamples((state) => {
      const updatedValue = !state
      return updatedValue
    })
  }

  function handleConvertIntegerToNumber() {
    setIntegerToNumber((state) => {
      const updatedValue = !state
      return updatedValue
    })
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
              <label className='whitespace-nowrap'>
                Convert null values to:
              </label>
              <Select onValueChange={
                (value: ConvertNullToType) => setConvertNullToType(value)
              }>
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
                onCheckedChange={handleAddValuesAsExamples}
              />
              <label htmlFor='add-examples'>
                Add values as examples
              </label>
            </div>
            <div className='space-x-2'>
              <Checkbox
                id='integer-to-number'
                checked={integerToNumber}
                onCheckedChange={handleConvertIntegerToNumber}
              />
              <label htmlFor='integer-to-number'>
                Convert integer values to number
              </label>
            </div>
            <div className='space-x-2'>
              <Checkbox
                id='output-yaml'
                checked={outputYaml}
                onCheckedChange={handleOutputYalmConvert}
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
                style={style}
                placeholder="Please enter JSON code."
                value={inputValue}
                language='json'
                onChange={(e) => setInputValue(e.target.value)}
                className='resize-none'
              />
            </div>
            <div className='w-full'>
              <h3 className='mb-2'>Output:</h3>
              {outputYaml
                ? (<CodeEditor
                  style={style}
                  value={outputValue}
                  language='yaml'
                  onChange={(e) => setInputValue(e.target.value)}
                  className='resize-none'
                />)
                : (<JsonView
                  enableClipboard={false}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  typeof=''
                  value={Object(outputValue)}
                  className='resize-none'
                  style={style}
                />)
              }
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
