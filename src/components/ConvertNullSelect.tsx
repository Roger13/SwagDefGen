import { ConvertNullToType } from '@/@types/convertNullToType'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem
} from '@/components/ui/select'
import { Dispatch } from 'react'

interface ConvertNullSelectProps {
  setConvertNullToType: Dispatch<React.SetStateAction<ConvertNullToType>>
}

export default function ConvertNullSelect({
  setConvertNullToType
}: ConvertNullSelectProps) {
  return (
    <div className='flex items-center gap-3'>
      <label className='whitespace-nowrap'>
        Convert null values to:
      </label>
      <Select onValueChange={
        (value: ConvertNullToType) => setConvertNullToType(value)
      }>
        <SelectTrigger className="w-28">
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
  )
}