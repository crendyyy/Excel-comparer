import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'
import taskKeys from '.'
import useLoadingToast from '../../hooks/useToast'

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  const axiosClient = useAxios()

  const toast = useLoadingToast()

  return useMutation({
    mutationFn: ({ id, data }) => {
      toast.loading('Memperbarui Status...')
      return axiosClient._patch(`/v1/tasks/${id}`, data)
    },

    onSuccess: () => {
      toast.update('Status diperbarui', 'success')
      queryClient.invalidateQueries({ queryKey: taskKeys.lists })
    },

    onError: () => {
      toast.update('Gagal, silahkan coba lagi', 'error')
    },
  })
}

export default useUpdateTask
