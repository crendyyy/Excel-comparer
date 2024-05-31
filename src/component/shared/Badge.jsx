const Badge = ({ status, text }) => {
  const styles = {
    success: 'text-green-600 bg-green-100',
    danger: 'text-red-600 bg-red-100',
    warning: 'text-yellow-600 bg-yellow-100',
    info: 'text-primary-darken bg-primary-ligthen',
  }

  return <div className={`inline-flex rounded-lg  px-2 py-1 text-xs font-medium ${styles[status]}`}>{text}</div>
}

export default Badge
