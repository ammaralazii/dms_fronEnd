export default [
  { heading: 'Roles & Permissions' },
  {
    title: 'Roles',
    icon: { icon: 'ph-address-book' },
    children: [
      {
        title: 'Super Admin',
        to: 'roles-super-admin',
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'User',
        to: 'roles-user',
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'Manager',
        to: { name: 'roles-manager', params: { id: 21 } },
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'Admin',
        to: { name: 'roles-admin', params: { id: 21 } },
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'Custom',
        to: { name: 'roles-custom', params: { id: 21 } },
        action: 'manage',
        subject: 'Auth',
      },
    ],
  },
]
