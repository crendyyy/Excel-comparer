import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'
import taskKeys from '.'
import useLoadingToast from '../../hooks/useToast'

export const useSubmitTask = () => {
  const queryClient = useQueryClient()
  const axiosClient = useAxios()

  const toast = useLoadingToast()

  return useMutation({
    mutationFn: ({ id, data }) => {
      toast.loading('Memproses Data...')
      return axiosClient._post(`/v1/tasks/${id}/submit`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
    },

    onSuccess: () => {
      toast.update('Data diproses', 'success')
      queryClient.invalidateQueries({ queryKey: taskKeys.lists })
    },

    onError: () => {
      toast.update('Gagal, silahkan coba lagi', 'error')
    },
  })
}

export default useSubmitTask
