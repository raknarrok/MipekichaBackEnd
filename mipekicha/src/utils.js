import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'
import { dirname } from 'path'

const __filename = fileURLToPath( import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)
