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

export const filterResponse = (response = [], criteria = {}) => {
  return response.filter((item) =>
    Object.entries(criteria).every(([key, filter]) => {
      if (!filter.value) return true

      if (filter.regex) {
        const regex = new RegExp(filter.value, 'i')
        return regex.test(item[key])
      }

      if (filter.parent && item[filter.parent]) {
        return item[filter.parent][key] === filter.value
      }
      return item[key] === filter.value
    }),
  )
}

export const columnSorter = (columnName) => (a, b) => {
  const columnKey = slugify(columnName, { replacement: '_', lower: true })

  const columnValueA = a[columnKey]
  const columnValueB = b[columnKey]

  const numericValueA = Number(columnValueA)
  const numericValueB = Number(columnValueB)

  if (!isNaN(numericValueA) && !isNaN(numericValueB)) {
    return numericValueA - numericValueB
  }

  if (typeof columnValueA === 'string' && typeof columnValueB === 'string') {
    return columnValueA.localeCompare(columnValueB)
  }

  return 0
}

export const findMatchCondition = (conditions, targetValue) => {
  if (conditions.length === 0) return {}
  const sortedConditions = [...conditions].sort((a, b) => b.end - a.end)

  const matchingCondition = sortedConditions.find((condition) => {
    const { start, end } = condition

    if (end === '>') {
      if (parseFloat(targetValue) >= start) {
        return true
      }
    } else if (end === '<') {
      if (parseFloat(targetValue) <= start) {
        return true
      }
    } else {
      if (parseFloat(targetValue) >= start && parseFloat(targetValue) <= end) {
        return true
      }
    }
  })

  return matchingCondition || {}
}
