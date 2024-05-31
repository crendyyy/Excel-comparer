import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'
import taskKeys from '.'

export const useSubmitTask = () => {
  const queryClient = useQueryClient()
  const axiosClient = useAxios()

  return useMutation({
    mutationFn: ({ id, data }) => {
      return axiosClient._post(`/v1/tasks/${id}/submit`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
    },

    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: taskKeys.lists })
    // },

    onError: () => {},
  })
}

export default useSubmitTask
