function log(label, color1, color2) {
  return function ({ isGroup = false } = {}) {
    return function (...values) {
      const [title, ...vals] = values
      if (values.length > 1) {
        console.groupCollapsed(
          `%c ${label} %c ${title} `,
          color1,
          color2,
        )
        if (isGroup === false) {
          vals.forEach(value => {
            if (typeof value === 'function') {
              value()
            } else {
              console.log(value)
            }
          })
          console.groupEnd()
        }
      } else {
        if (isGroup) {
          console.groupCollapsed(
            `%c ${label} %c ${title} `,
            color1,
            color2,
          )
        } else {
          console.groupCollapsed(
            `%c ${label} %c ${title} `,
            color1,
            color2,
          )
          console.trace()
          console.groupEnd()
        }
      }
    }
  }
}

const methods = {
  error: log(
    'Error:',
    'background: #F44336; color: #fff; border-radius: 3px 0 0 3px;',
    'background: #263238; color: #eeffff; border-radius: 0 3px 3px 0; font-weight: 400;'
  ),
  warning: log(
    'Warning:',
    'background: #c6a700; color: #fff; border-radius: 3px 0 0 3px;',
    'background: #263238; color: #eeffff; border-radius: 0 3px 3px 0; font-weight: 400;'
  ),
  info: log(
    'Info:',
    'background: #0069c0; color: #fff; border-radius: 3px 0 0 3px;',
    'background: #263238; color: #eeffff; border-radius: 0 3px 3px 0; font-weight: 400;'
  ),
}

export default {
  error: methods.error(),
  warning: methods.warning(),
  info: methods.info(),

  groupStart: {
    error: methods.error({ isGroup: true }),
    warning: methods.warning({ isGroup: true }),
    info: methods.info({ isGroup: true }),
  },

  groupEnd: console.groupEnd,
}
