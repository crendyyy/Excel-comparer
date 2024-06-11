import { useMutation } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'
import useLoadingToast from '../../hooks/useToast'

export const useCompareSKUExcel = () => {
  const axiosClient = useAxios()

  const toast = useLoadingToast()

  return useMutation({
    mutationFn: ({ data }) => {
      toast.loading('Memproses data...')
      return axiosClient._post(`/v1/excels/missing-sku`, data)
    },

    onSuccess: () => {
      toast.update('Data diproses', 'success')
    },

    onError: () => {
      toast.update('Gagal, silahkan coba lagi', 'error')
    },
  })
}

export default useCompareSKUExcel
