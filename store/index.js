let system = null;
const regeneratorRuntime = require('../libs/regenerator-runtime');
import wxapi from '../libs/wx-api-promise/index';

export default {
    async getSystem(){
        if(!system){
            let res = await wxapi.getSystemInfo();
            if(res.success){
                system = res.res;
                return system;
            }
        }else{
            return await system;
        }
    }
}