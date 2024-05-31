import { useQuery } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'
import taskKeys from '.'

export const useGetAllTask = (params = {}) => {
  const axiosClient = useAxios()

  const filteredParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value))

  const queryParams = new URLSearchParams(filteredParams)

  const cacheKey = Object.keys(filteredParams).length === 0 ? taskKeys.lists : taskKeys.list(filteredParams)

  const query = useQuery({
    queryKey: cacheKey,
    staleTime: Infinity,
    queryFn: () => axiosClient._get(`/v1/tasks?${queryParams.toString()}`),
  })

  return { ...query, data: query.data?.data }
}

export const useGetOneTask = (id) => {
  const axiosClient = useAxios()

  const cacheKey = taskKeys.detail(id)

  const query = useQuery({
    queryKey: cacheKey,
    staleTime: Infinity,
    queryFn: () => axiosClient._get(`/v1/tasks/${id}`),
  })

  return { ...query, data: query.data?.data }
}
