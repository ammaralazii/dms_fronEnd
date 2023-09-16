export default (data: any, checked?: boolean) => {
  const items: Record<string, any> = {}

  data.forEach((permissionItem: any, index: any) => {
    const permissionId = permissionItem.PermissionId
    const item = permissionItem.PermissionNameEn.split('-')
    const category = item[0].replace(/_/g, '')

    if (items[category]) {
      items[category].checkboxes.push({
        value: checked || false,
        title: item[1],
        id: permissionId,
      })
    }
    else {
      items[category] = {
        allChecked: false,
        title: category,
        checkboxes: [
          { value: checked || false, title: item[1], id: permissionId },
        ],
      }
    }
  })

  return Object.values(items)
}
