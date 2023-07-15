export default [
  { heading: 'Charts' },
  {
    title: 'Charts',
    icon: { icon: 'tabler-chart-donut' },
    children: [
      {
        title: 'Apex Chart',
        to: 'charts-apex-chart',
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'Chartjs',
        to: 'charts-chartjs',
        action: 'manage',
        subject: 'Auth',
      },
    ],
    action: 'manage',
    subject: 'Auth',
  },
]
