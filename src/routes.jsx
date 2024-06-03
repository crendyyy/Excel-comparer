import TableDetail from './pages/TableDetail'
import TaskList from './pages/TaskList'
import TaskDetail from './pages/TaskDetail'

import TableResultsDetail from './component/Table/TableResultsDetail'
import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { Outlet } from 'react-router-dom'
import Sider from 'antd/es/layout/Sider'
import Aside from './component/shared/Aside'
import { Bounce, ToastContainer } from 'react-toastify'

const routes = [
  {
    path: '/',
    element: (
      <>
        <ToastContainer
          position='top-right'
          autoClose={1000}
          draggable={true}
          transition={Bounce}
          pauseOnHover={false}
        />

        <Layout style={{ minHeight: '100vh' }}>
          <Layout>
            <Sider width={240}>
              <Aside />
            </Sider>

            <Content>
              <main className='w-full'>
                <Outlet />
              </main>
            </Content>
          </Layout>
        </Layout>
      </>
    ),
    children: [
      { index: true, element: <TableDetail /> },
      {
        path: '/table/:filename',
        children: [{ index: true, element: <TableResultsDetail /> }],
      },
      {
        path: '/tugas',
        children: [
          { index: true, element: <TaskList /> },
          { path: ':taskId', element: <TaskDetail /> },
        ],
      },
    ],
  },
]

export default routes
