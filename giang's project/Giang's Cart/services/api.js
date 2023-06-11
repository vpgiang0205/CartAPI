import { DOMAIN } from './../common/constants.js';
export default class Api {
    callApi(uri, method, data) {
        return axios({
            url: `${DOMAIN}/${uri}`,
            method,
            data,
        });
    }
}

export class Service {
    getItemById(id){
       Api.callApi(id, 'GET', null)
       .then((rs) => {
           // run renderUI
           console.log(rs.data)
       })
                .catch((error) => {
                    console.log(error)
                })
    }
}