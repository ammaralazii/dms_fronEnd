export default [
  {
    title: 'Dashboards',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'Analytics',
        to: 'dashboards-analytics',
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'eCommerce',
        to: 'dashboards-ecommerce',
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'CRM',
        to: 'dashboards-crm',
        action: 'manage',
        subject: 'Auth',
      },
    ],
    badgeContent: '2',
    badgeClass: 'bg-light-primary text-primary',
    action: 'manage',
    subject: 'Auth',
  },
]
