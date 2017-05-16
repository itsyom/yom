/**
 * Created by ll on 2017/5/15.
 */

///<reference path="../math/Math.ts"/>

namespace HEY{

    export class Texture{


        uuid:string = null;

        version:number = 0;


        image:HTMLImageElement = null;

        format:number = RGBAFormat;

        type:number = UnsignedByteType;


        wrapS:number = RepeatWrapping;

        wrapT:number = RepeatWrapping;

        flipY:boolean = true;

        constructor(){
            this.uuid = _Math.generateUUID();

        }

        set needsUpdate(val:boolean){
            if(val === true) this.version ++;
        }



    }

}