import TableBerat from './pages/TableWeight'
import TableDetail from './pages/TableDetail'
import Tugas from './pages/Tugas'

import RootLayout from './pages/layout/RootLayout'
import SidebarLayout from './pages/layout/SidebarLayout'

const routes = [
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SidebarLayout />,
        children: [
          { index: true, element: <TableDetail /> },
          {
            path: '/tableBerat',
            children: [{ index: true, element: <TableBerat /> }],
          },
          {
            path: '/tugas',
            children: [{ index: true, element: <Tugas /> }],
          },
        ],
      },
    ],
  },
]

export default routes
