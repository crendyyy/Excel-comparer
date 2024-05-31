const taskKeys = {
  lists: ['tasks', 'list'],
  list: (filter) => ['tasks', 'list', { ...filter }],
  detail: (id) => ['tasks', 'detail', id],
}

export default taskKeys
