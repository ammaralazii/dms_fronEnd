export default function (newPermissions: any, oldPermissions: any) {
  oldPermissions.forEach((oldPermission: any) => {
    oldPermission.checkboxes.forEach((oldChecked: any) => {
      if (oldChecked.value === true && !newPermissions.some((newItem: any) => newItem.id === oldChecked.id)) {
        // Add the old checked item to newPermissions if it doesn't already exist
        newPermissions.push(oldChecked.id)
      }
    })
  })

  return newPermissions
}

