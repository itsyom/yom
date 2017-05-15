/**
 * Created by hey on 2017/5/14.
 */
namespace  HEY{

    export class VertexAttribute{

        bufferData:Float32Array = null;
        size:number = 3;
        type:number = null;

        constructor(data:Float32Array,size:number,type:number = null){
            this.bufferData = data;
            this.size = size;
            this.type = type | GL.gl.FLOAT;
        }
    }

    export class IndexAttribute{

        bufferData:Int16Array|Int32Array = null;
        count:number = 3;
        offset:number = 0;
        type:number = null;

        constructor(data:Uint16Array|Uint32Array,count:number = null,offset:number = 0){
            this.bufferData = data;
            this.count = count || data.length;

            if(data instanceof  Uint16Array){
                this.type = GL.gl.UNSIGNED_SHORT;
            }else if(data instanceof Uint32Array){
                this.type = GL.gl.UNSIGNED_INT;
            }else{
                console.error("HEY: unknow array type");
            }
            this.offset = offset;
        }

    }




}