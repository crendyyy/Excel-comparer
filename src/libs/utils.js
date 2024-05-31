import slugify from 'slugify'

export const dateFormatter = (dateStr, backward = false) => {
  if (backward) {
    const [datePart, timePart] = dateStr.split(' - ')
    return new Date(`${datePart}T${timePart}:00Z`)
  }

  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} - ${hours}:${minutes}`
}

export const filterResponse = (response = [], filters = {}) => {
  return response.filter((data) =>
    Object.entries(filters).every(([key, filter]) => {
      if (!filter.value) return true

      if (filter.regex) {
        const regex = new RegExp(filter.value, 'i')
        return regex.test(data[key])
      }

      return data[key] === filter.value
    }),
  )
}

export const columnSorter = (column) => (a, b) => {
  const dataIndex = slugify(column, { replacement: '_', lower: true })

  const aValue = a[dataIndex]
  const bValue = b[dataIndex]

  const aNumber = Number(aValue)
  const bNumber = Number(bValue)

  if (!Number.isNaN(aNumber) && !Number.isNaN(bNumber)) {
    return aNumber - bNumber
  }

  if (typeof aValue === 'string' && typeof bValue === 'string') {
    return aValue.localeCompare(bValue)
  }

  return 0
}

export const findMatchCondition = (config, record) => {
  const sortedConfig = config.sort((a, b) => b.value - a.value)

  const chosenConfig = sortedConfig.find((config) => {
    if (config.type === 'greater_than' && Number(record.persentase) > Number(config.value)) {
      return true
    } else if (config.type === 'lesser_than' && Number(record.persentase) < Number(config.value)) {
      return true
    } else if (config.type === 'equal' && Number(record.persentase) === Number(config.value)) {
      return true
    }
  })

  return chosenConfig
}
