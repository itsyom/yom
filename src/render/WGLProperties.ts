/**
 * Created by ll on 2017/5/16.
 */

namespace HEY{

    let properties:any = {};

    export class WGLProperties{

        get(obj:any){
            let map = properties[obj.uuid];
            if(!map){
                map ={};
                properties[obj.uuid] = map;
            }
            return map;
        }

        remove(obj:any){
            delete properties[obj.uuid];
        }

        clear(){
            properties = {};
        }

    }

}