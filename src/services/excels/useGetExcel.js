import { useQuery } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'
import excelsKeys from '.'

export const useGetExcel = () => {
  const axiosClient = useAxios()

  const cacheKey = excelsKeys.lists

  const query = useQuery({
    queryKey: cacheKey,
    staleTime: Infinity,
    queryFn: () => axiosClient._get(`/v1/excels`),
  })

  return { ...query, data: query.data?.data }
}
