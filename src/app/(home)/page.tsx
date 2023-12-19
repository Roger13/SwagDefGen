'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import checkJson from '@/lib/utils/checkJson'
import { FormEvent, useState } from 'react'

type ConvertNull = 'null' | 'string' | 'number' | 'integer' | 'boolean'

export default function Home() {
  const [inputValue, setInputValue] = useState<string>('')
  const [outputValue, setOutputValue] = useState<string>('')
  const [convertNull, setConvertNull] = useState<ConvertNull>('null')
  const [addExamples, setAddExamples] = useState(false)
  const [integerToNumber, setIntegerToNumber] = useState(false)
  const [outputYalm, setOutputYalm] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setOutputValue(inputValue)
    console.log(convertNull)

    const output = checkJson(inputValue)
    setOutputValue(output)
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
            <Select onValueChange={(value: ConvertNull) => setConvertNull(value)}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Convert null values to" />
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
            <div className='w-full'>
              <h3 className='mb-2'>Input:</h3>
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='resize-none'
                rows={30}
              />
            </div>
            <div className='w-full'>
              <h3 className='mb-2'>Output:</h3>
              <Textarea
                value={outputValue}
                className='resize-none'
                rows={30}
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
