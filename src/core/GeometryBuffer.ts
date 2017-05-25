/**
 * Created by ll on 2017/5/12.
 */


namespace HEY{

    let count:number = 0;

    function geometryIDCount(){
        return count++;
    }

    export class GeometryBuffer{

        attributes:{[key:string]:any} = {};

        index:IndexAttribute = null;

        // vertexArrayBuffer:number = null; //todo 以后这东西也由引擎来维护

        version:number = 0;

        readonly id:number = 0;

        constructor(){
            this.id = geometryIDCount();
        }

        get(name:string){
            return this.attributes[name];
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

        set needsUpdate(b:boolean){
            if(b === true){
                this.version += 1;
            }
        }

    }
}