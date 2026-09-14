import bcrypt from 'bcryptjs'

const passwords = ['demo123']

passwords.forEach(password => {
  const hash = bcrypt.hashSync(password, 10)
  console.log(`Password: ${password}`)
  console.log(`Hash: ${hash}`)
  console.log()
})