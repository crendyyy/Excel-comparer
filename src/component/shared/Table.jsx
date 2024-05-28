import { Link } from 'react-router-dom'

const Table = ({ children }) => {
  return <div className='shadow-xs overflow-hidden rounded-primary border-2 border-gray-200 font-bold'>{children}</div>
}

const TableHead = ({ children }) => {
  return <div className='flex border-b bg-[#799ADC] text-primary-darken'>{children}</div>
}

const TableColumn = ({ children, className }) => {
  return <div className={`flex h-14 w-full items-center px-4 text-white font-bold text-sm ${className}`}>{children}</div>
}

const TableBody = ({ children }) => {
  return <div className='flex flex-col bg-white'>{children}</div>
}

const TableRow = ({ link, children }) => {
  const Wrapper = link ? Link : 'div'
  return (
    <Wrapper to={link} className='flex w-full items-center border-b last:border-none'>
      {children}
    </Wrapper>
  )
}

const TableCell = ({ children, className }) => {
  return <div className={`flex h-full min-h-14 py-4 w-full items-center px-4 ${className}`}>{children}</div>
}

export { Table, TableHead, TableColumn, TableBody, TableRow, TableCell }
