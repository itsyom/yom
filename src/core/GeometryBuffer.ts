/**
 * Created by ll on 2017/5/12.
 */


namespace HEY{
    export class GeometryBuffer{

        attributes:{[key:string]:any} = {};

        vertexArrayBuffer:number = null;

        constructor(){

        }

        get(type:string){
            return this.attributes[type];
        }



    }
}