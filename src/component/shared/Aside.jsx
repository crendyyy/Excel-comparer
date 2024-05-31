import { NavLink } from 'react-router-dom'
import BriefcaseIcon from '../icons/BriefcaseIcon'
import DocumentIcon from '../icons/DocumentIcon'
import Title from 'antd/es/typography/Title'

const Sidebar = () => {
  return (
    <>
      <div className='p-8'>
        <Title level={3} style={{ color: 'white' }}>
          Logo
        </Title>
      </div>

      <div className='flex flex-col gap-4 px-4'>
        <Menu link='/'>
          <DocumentIcon /> Excel
        </Menu>

        <Menu link='/tugas'>
          <BriefcaseIcon /> Tugas
        </Menu>
      </div>
    </>
  )
}

const Menu = ({ link, children }) => {
  return (
    <NavLink
      to={link}
      className={({ isActive, isPending }) =>
        `flex h-12 items-center gap-4 rounded-full pl-4 font-semibold text-white ${
          isActive ? 'bg-primary' : 'text-black'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default Sidebar
