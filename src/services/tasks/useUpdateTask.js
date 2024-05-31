import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'
import taskKeys from '.'

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  const axiosClient = useAxios()

  return useMutation({
    mutationFn: ({ id, data }) => {
      return axiosClient._patch(`/v1/tasks/${id}`, data)
    },

    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: taskKeys.lists })
    // },

    onError: () => {},
  })
}

export default useUpdateTask
