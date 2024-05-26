import { Outlet } from 'react-router-dom'
import Aside from '../../component/shared/Aside'
const SidebarLayout = () => {
  return (
    <>
      <div className='flex'>
        <Aside />
        <main className='ml-60 w-full pb-[1px]'>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default SidebarLayout
