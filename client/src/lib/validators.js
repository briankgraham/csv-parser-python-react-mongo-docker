import validator from 'validator'

export const isValidEmail = email => !!(email && validator.isEmail(email))
export const isValidName = (name = '') => /^[A-Za-z\s-]+$/.test(name.trim())

export const createUserFormValidators = {
  email: email => isValidEmail(email),
  // Allow spaces and hyphens for names
  firstName: name => name && isValidName(name),
  lastName: name => name && isValidName(name)
}

export const authValidators = {
  email: email => (email && !validator.isEmail(email) ? 'Not a valid email address' : null),
  firstName: name => (!isValidName(name) ? 'Not a valid first name' : null),
  lastName: name => (!isValidName(name) ? 'Not a valid last name' : null)
}

// NOTE: taken from here: https://github.com/miguelmota/is-valid-domain/blob/master/is-valid-domain.js
// Input examples: 'gmail.com' returns true, 'gmail.ai, another.com' returns true
// 'gmail.ai, notreal' returns false
export const isValidEmailDomain = v => {
  if (typeof v !== 'string') return false
  let isValid = false
  const domains = v.split(',')

  domains.forEach(domain => {
    const parts = domain.trim().split('.')
    if (parts.length <= 1) {
      isValid = false
      return
    }

    const tld = parts.pop()
    const tldRegex = /^(?:xn--)?[a-zA-Z0-9]+$/gi

    if (!tldRegex.test(tld)) {
      isValid = false
      return
    }

    isValid = parts.every(host => {
      const hostRegex = /^(?!:\/\/)([a-zA-Z0-9]+|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])$/gi

      return hostRegex.test(host)
    })
  })

  return isValid
}
