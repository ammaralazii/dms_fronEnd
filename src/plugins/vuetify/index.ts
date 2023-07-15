import { createVuetify } from 'vuetify'
import { VForm } from 'vuetify/components'
import defaults from './defaults'
import { icons } from './icons'
import theme from './theme'

// Styles
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default createVuetify({
  components: {
    VForm,
  },
  defaults,
  icons,
  theme,
})
