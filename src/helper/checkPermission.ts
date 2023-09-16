import prmissionStructuer from './prmissionStructuer'

export default function (allPermissions: any, permissions: any) {
  const myPermissions = prmissionStructuer(permissions[0].permissions, true)

  return allPermissions.map((allPermission: any) => {
    const matchingPermission = myPermissions.find(
      (myPermission: any) => allPermission.title === myPermission.title,
    )

    let parentChecked = true
    if (matchingPermission) {
      allPermission.checkboxes.forEach((checkbox: any) => {
        const matchingMyCheckbox = matchingPermission.checkboxes.find(
          (myCheckbox: any) => myCheckbox.title === checkbox.title,
        )

        if (matchingMyCheckbox)
          checkbox.value = true
        else if (!matchingMyCheckbox && parentChecked)
          parentChecked = false
      })
      allPermission.allChecked = parentChecked
    }

    return allPermission
  })
}
