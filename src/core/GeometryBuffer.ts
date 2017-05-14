/**
 * Created by ll on 2017/5/12.
 */


namespace HEY{
    export class GeometryBuffer{

        attributes:{[key:string]:any} = {};

        vertexArrayBuffer:number = null; //todo 以后这东西也由引擎来维护

        constructor(){

        }

        get(type:string){
            return this.attributes[type];
        }



    }
}