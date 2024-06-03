import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FormProvider } from './context/FormContext'

import routes from './routes'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

const router = createBrowserRouter(routes)

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FormProvider>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </FormProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
