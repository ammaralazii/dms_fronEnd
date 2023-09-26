export default [
  { heading: 'Apps & Pages' },
  {
    title: 'Main Store',
    icon: { icon: 'ph-database' },
    children: [
      {
        title: 'Devices',
        children: [
          {
            title: 'List',
            to: 'apps-main-store-devices-list',
            action: 'manage',
            subject: 'Auth',
          },
          {
            title: 'Add',
            to: 'apps-main-store-devices-add',
            action: 'manage',
            subject: 'Auth',
          },
        ],
      },
      {
        title: 'Accessories',
        to: 'apps-main-store-accessories',
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'SIM Card',
        to: { name: 'apps-main-store-cards' },
        action: 'manage',
        subject: 'Auth',
      },
    ],
  },

  // hhhh
  // {
  //   title: 'Email',
  //   icon: { icon: 'tabler-mail' },
  //   to: 'apps-email',
  //   action: 'manage',
  //   subject: 'Auth',
  // },
  // {
  //   title: 'Chat',
  //   icon: { icon: 'tabler-message' },
  //   to: 'apps-chat',
  //   action: 'manage',
  //   subject: 'Auth',
  // },
  {
    title: 'Calendar',
    icon: { icon: 'tabler-calendar' },
    to: 'apps-calendar',
    action: 'manage',
    subject: 'Auth',
  },
  {
    title: 'Invoice',
    icon: { icon: 'tabler-file' },
    action: 'manage',
    subject: 'Auth',

    children: [
      {
        title: 'List',
        to: 'apps-invoice-list',
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'Preview',
        to: { name: 'apps-invoice-preview-id', params: { id: '5036' } },
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'Edit',
        to: { name: 'apps-invoice-edit-id', params: { id: '5036' } },
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'Add',
        to: 'apps-invoice-add',
        action: 'manage',
        subject: 'Auth',
      },
    ],
  },
  {
    title: 'User',
    icon: { icon: 'tabler-user' },
    children: [
      {
        title: 'List',
        to: 'apps-user-list',
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'View',
        to: { name: 'apps-user-view-id', params: { id: 21 } },
        action: 'manage',
        subject: 'Auth',
      },
    ],
  },
  {
    title: 'Pages',
    icon: { icon: 'tabler-file' },
    children: [
      {
        title: 'Authentication',
        children: [
          {
            title: 'Login',
            children: [
              { title: 'Login v1', to: 'pages-authentication-login-v1', target: '_blank' },
              { title: 'Login v2', to: 'pages-authentication-login-v2', target: '_blank' },
            ],
            action: 'manage',
            subject: 'Auth',
          },
          {
            title: 'Register',
            children: [
              {
                title: 'Register v1',
                to: 'pages-authentication-register-v1',
                target: '_blank',
                action: 'manage',
                subject: 'Auth',
              },
              {
                title: 'Register v2',
                to: 'pages-authentication-register-v2',
                target: '_blank',
                action: 'manage',
                subject: 'Auth',
              },
            ],
          },
          {
            title: 'Verify Email',
            children: [
              {
                title: 'Verify Email v1',
                to: 'pages-authentication-verify-email-v1',
                target: '_blank',
                action: 'manage',
                subject: 'Auth',
              },
              {
                title: 'Verify Email v2',
                to: 'pages-authentication-verify-email-v2',
                target: '_blank',
                action: 'manage',
                subject: 'Auth',
              },
            ],
          },
          {
            title: 'Forgot Password',
            children: [
              {
                title: 'Forgot Password v1',
                to: 'pages-authentication-forgot-password-v1',
                target: '_blank',
                action: 'manage',
                subject: 'Auth',
              },
              {
                title: 'Forgot Password v2',
                to: 'pages-authentication-forgot-password-v2',
                target: '_blank',
                action: 'manage',
                subject: 'Auth',
              },
            ],
          },
          {
            title: 'Reset Password',
            children: [
              {
                title: 'Reset Password v1',
                to: 'pages-authentication-reset-password-v1',
                target: '_blank',
                action: 'manage',
                subject: 'Auth',
              },
              { title: 'Reset Password v2', to: 'pages-authentication-reset-password-v2', target: '_blank' },
            ],
          },
          {
            title: 'Two Steps',
            children: [
              {
                title: 'Two Steps v1',
                to: 'pages-authentication-two-steps-v1',
                target: '_blank',
                action: 'manage',
                subject: 'Auth',
              },
              {
                title: 'Two Steps v2',
                to: 'pages-authentication-two-steps-v2',
                target: '_blank',
                action: 'manage',
                subject: 'Auth',
              },
            ],
          },
        ],
      },
      {
        title: 'Help Center',
        to: 'pages-help-center',
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'User Profile',
        to: { name: 'pages-user-profile-tab', params: { tab: 'profile' } },
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'Account Settings',
        to: { name: 'pages-account-settings-tab', params: { tab: 'account' } },
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'Pricing',
        to: 'pages-pricing',
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'FAQ',
        to: 'pages-faq',
        action: 'manage',
        subject: 'Auth',
      },
      {
        title: 'Miscellaneous',
        children: [
          {
            title: 'Coming Soon',
            to: 'pages-misc-coming-soon',
            target: '_blank',
            action: 'manage',
            subject: 'Auth',
          },
          {
            title: 'Under Maintenance',
            to: 'pages-misc-under-maintenance',
            target: '_blank',
            action: 'manage',
            subject: 'Auth',
          },
          {
            title: 'Page Not Found - 404',
            to: 'pages-misc-not-found',
            target: '_blank',
            action: 'manage',
            subject: 'Auth',
          },
          {
            title: 'Not Authorized - 401',
            to: 'pages-misc-not-authorized',
            target: '_blank',
            action: 'manage',
            subject: 'Auth',
          },
          {
            title: 'Server Error - 500',
            to: 'pages-misc-internal-server-error',
            target: '_blank',
            action: 'manage',
            subject: 'Auth',
          },
        ],
      },
    ],
  },
]
