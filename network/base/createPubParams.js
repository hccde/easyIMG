// import token from './token'
import tokenManager from '../../global/token';
export default () => {
  return {
    "authorization": tokenManager.get('token'),
    "Content-Type": 'application/json',
    "Accept": 'application/json'
  }
}
