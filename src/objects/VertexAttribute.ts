/**
 * Created by hey on 2017/5/14.
 */
namespace  HEY{

    export class VertexAttribute{

        bufferData:Float32Array = null;
        size:number = 3;
        type:number = null;

        constructor(data:Float32Array,size:number,type:number){
            this.bufferData = data;
            this.size = size;
            this.type = type;
        }
    }

    export class IndexAttribute{

        bufferData:Int16Array = null;
        count:number = 3;
        offset:number = 0;
        type:number = null;

        constructor(data:Int16Array,count:number,type:number,offset:number = 0){
            this.bufferData = data;
            this.count = count;
            this.type = type;
            this.offset = offset;
        }

    }




}