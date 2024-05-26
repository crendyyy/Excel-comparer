import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className='fixed inset-0 z-50 w-60 bg-white py-10 px-6 flex flex-col gap-10'>
      <h1 className='font-semibold'>Excel Comparer</h1>

      <div className='flex flex-col gap-6'>
        <Menu text='Table Detail' link='/' />
        <Menu text='Table Berat' link='/tableBerat' />
        <Menu text='Tugas' link='/tugas' />
      </div>
    </aside>
  )
}

const Menu = ({ text, link }) => {
  return (
    <NavLink
      to={link}
      className={({ isActive, isPending }) =>
        `flex h-10 cursor-pointer items-center gap-4 rounded-lg pl-2 font-semibold text-base hover:bg-gray-200 hover:text-black ${isActive ? 'text-primary' : 'text-gray-500'}`
      }
    >
      {text}
    </NavLink>
  )
}

export default Sidebar
