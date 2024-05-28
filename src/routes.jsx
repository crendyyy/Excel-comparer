import TableBerat from "./pages/TableWeight";
import TableDetail from "./pages/TableDetail";
import Tugas from "./pages/Tugas";

import RootLayout from "./pages/layout/RootLayout";
import SidebarLayout from "./pages/layout/SidebarLayout";
import TableResultsDetail from "./component/Table/TableResultsDetail";

const routes = [
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <SidebarLayout />,
        children: [
          { index: true, element: <TableDetail /> },
          {
            path: "/tableBerat",
            children: [{ index: true, element: <TableBerat /> }],
          },
          {
            path: "/tugas",
            children: [{ index: true, element: <Tugas /> }],
          },
          {
            path: '/table/:filename',
            children: [
              { index: true, element: <TableResultsDetail /> },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
