import { useMutation } from '@tanstack/react-query'
import useAxios from '../../hooks/useAxios'

export const useSubmitExcel = () => {
  const axiosClient = useAxios()

  return useMutation({
    mutationFn: ({ data }) => {
      return axiosClient._post(`/v1/excel/compare`, data)
    },

    onError: () => {},
  })
}

export const useSubmitMissingSKU = () => {
  const axiosClient = useAxios()

  return useMutation({
    mutationFn: ({ data }) => {
      return axiosClient._post(`/v1/excel/missing-sku`, data)
    },

    onError: () => {},
  })
}

export const useSubmitSaveTask = () => {
  const axiosClient = useAxios()

  return useMutation({
    mutationFn: ({ data }) => {
      return axiosClient._post(`/v1/tasks`, data)
    },

    onError: () => {},
  })
}