/**
 * Created by hey on 2017/5/14.
 */
namespace  HEY{

    export class VertexAttribute{

        uuid:string = null;

        array:Float32Array = null;
        size:number = 3;
        type:number = null;

        dynamic:boolean = false;

        version:number = 0;

        constructor(data:number[],size:number,type:number = null,dynamic:boolean = false){
            this.uuid = _Math.generateUUID();

            this.size = size;
            this.type = type || FLOAT;

            switch (this.type){
                case FLOAT:
                    this.array = new Float32Array(data);
                    break;
                default:
                    console.error("HEY:========== unknow type")
            }

            this.dynamic = dynamic;
        }

        set needsUpdate(b:boolean){
            if(b === true){
                this.version += 1;
            }
        }
    }

    export class IndexAttribute{

        uuid:string = null;

        array:Int16Array|Int32Array = null;
        count:number = 3;
        offset:number = 0;
        type:number = null;

        dynamic:boolean = false;

        version:number = 0;

        constructor(data:Uint16Array|Uint32Array,count:number = null,offset:number = 0,dynamic:boolean = false){
            this.uuid = _Math.generateUUID();

            this.array = data;
            this.count = count || data.length;

            if(data instanceof  Uint16Array){
                this.type = GL.gl.UNSIGNED_SHORT;
            }else if(data instanceof Uint32Array){
                this.type = GL.gl.UNSIGNED_INT;
            }else{
                console.error("HEY: unknow array type");
            }
            this.offset = offset;

            this.dynamic = dynamic;
        }

        set needsUpdate(b:boolean){
            if(b === true){
                this.version += 1;
            }
        }

    }




}