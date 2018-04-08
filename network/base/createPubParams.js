import token from './token'

export default () => {
  return {
    "authorization": token.get(),
    "Content-Type": 'application/json',
    "Accept": 'application/json'
  }
}
