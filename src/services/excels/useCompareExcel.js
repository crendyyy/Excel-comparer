// useCompareExcel.jsx
import { useMutation } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'
import useLoadingToast from '../../hooks/useToast'

export const useCompareExcel = () => {
  const axiosClient = useAxios()
  const toast = useLoadingToast()

  return useMutation({
    mutationFn: ({ data }) => {
      toast.loading('Memproses data...')

      const isFormData = data instanceof FormData

      const config = {
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        },
      }
      return axiosClient._post(`/v1/excels/compare`, data, config)
    },
    
    onSuccess: () => {
      toast.update('Data diproses', 'success')
    },

    onError: (error) => {
      console.error('Request failed:', error)
      toast.update('Gagal, silahkan coba lagi', 'error')
    },
  })
}

export default useCompareExcel
