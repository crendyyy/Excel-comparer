import TableDetail from "./pages/TableDetail";
import TaskListPage from './pages/TaskListPage'
import TaskDetailPage from './pages/TaskDetailPage'

import TableResultsDetail from './component/Table/TableResultsDetail'
import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { Outlet } from 'react-router-dom'
import Sider from 'antd/es/layout/Sider'
import Aside from './component/shared/Aside'

const routes = [
  {
    path: '/',
    element: (
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
          { index: true, element: <TaskListPage /> },
          { path: ':taskId', element: <TaskDetailPage /> },
        ],
      },
    ],
  },
]

export default routes
