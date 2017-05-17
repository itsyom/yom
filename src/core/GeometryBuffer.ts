/**
 * Created by ll on 2017/5/12.
 */


namespace HEY{

    export class GeometryBuffer{

        attributes:{[key:string]:any} = {};

        index:IndexAttribute = null;

        vertexArrayBuffer:number = null; //todo 以后这东西也由引擎来维护

        readonly id:number = 0;

        constructor(){
            this.id = 3;
        }

        get(type:string){
            return this.attributes[type];

        }

        setIndex(data:number[]){
            if ( Array.isArray( data ) ) {
                let array = arrayMax( data ) > 65535 ? new Uint32Array(data):new Uint16Array(data);
                this.index = new IndexAttribute(array);
            } else {
                this.index = data;
            }
        }

        addAttribute(name:string,attr:VertexAttribute){
            if(name){
                this.attributes[name] = attr;
            }
        }

    }
}