'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Document } from 'yaml'
import { ConvertNullToType } from '@/@types/convertNullToType'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import InputBox from '@/components/InputBox'
import OutputBox from '@/components/OutputBox'
import ConvertNullSelect from '@/components/ConvertNullSelect'
import Header from '@/components/Header'

import checkJson from '@/lib/utils/checkJson'
import { jsonToSwagger } from '@/lib/utils/jsonToSwagger'

export default function Home() {
  const [convertNullToType, setConvertNullToType]
    = useState<ConvertNullToType>('boolean')
  const [inputValue, setInputValue] = useState<string>('{ }')
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

  function handleSubmit(event?: FormEvent) {
    event?.preventDefault()
    
    if (outputYaml) {
      outputInYaml()
    } else {
      outputInJson()
    }
  }

  function outputInYaml() {
    if (!checkJson(inputValue)) return
    const json = JSON.parse(inputValue)
    const output = JSON.parse(
      jsonToSwagger(json, convertNullToType, addExamples, integerToNumber)
    )
    const doc = new Document()
    doc.contents = output
    setOutputValue(doc.toString())
  }

  function outputInJson() {
    if (!checkJson(inputValue)) return
    const json = JSON.parse(inputValue)
    const output = jsonToSwagger(
      json, convertNullToType, addExamples, integerToNumber
    )
    setOutputValue(JSON.parse(output))
  }
  
  return (
    <main className='flex justify-center items-center w-full'>
      <section className='w-full max-w-7xl p-6'>
        <Header />
        <form onSubmit={handleSubmit}>
          <div className='flex gap-6 my-6 space-y-2'>
            <ConvertNullSelect setConvertNullToType={setConvertNullToType} />
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
                checked={outputYaml}
                onCheckedChange={() => setOutputYaml(!outputYaml)}
              />
              <label htmlFor='output-yalm'>
                Output as YAML
              </label>
            </div>
          </div>
          <div className='flex gap-6'>
            <InputBox inputValue={inputValue} setInputValue={setInputValue} />
            <OutputBox outputYaml={outputYaml} outputValue={outputValue} />
          </div>
          <div className='flex my-6 w-full justify-end items-center'>
            <Button>Convert</Button>
          </div>
        </form>
      </section>
    </main>
  )
}
