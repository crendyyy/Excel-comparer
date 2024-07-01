import { useMutation } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'
import useLoadingToast from '../../hooks/useToast'

export const useDownloadTask = () => {
  const axiosClient = useAxios()

  const toast = useLoadingToast()

  return useMutation({
    mutationFn: ({ data }) => {
      toast.loading('Memproses data...')
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      return axiosClient._post(`/v1/tasks/archive`, data, config)
    },

    onSuccess: () => {
      toast.update('Data diproses', 'success')
    },

    onError: () => {
      toast.update('Gagal, silahkan coba lagi', 'error')
    },
  })
}

export default useDownloadTask
