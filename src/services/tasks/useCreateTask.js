import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'
import taskKeys from '.'
import useLoadingToast from '../../hooks/useToast'

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  const axiosClient = useAxios()

  const toast = useLoadingToast()

  return useMutation({
    mutationFn: ({ data }) => {
      toast.loading('Membuat tugas...')
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      return axiosClient._post(`/v1/tasks`, data, config)
    },

    onSuccess: () => {
      toast.update('Tugas dibuat', 'success')
      queryClient.invalidateQueries({ queryKey: taskKeys.lists })
    },

    onError: () => {
      toast.update('Gagal, silahkan coba lagi', 'error')
    },
  })
}

export default useCreateTask
