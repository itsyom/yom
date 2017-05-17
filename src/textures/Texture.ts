/**
 * Created by ll on 2017/5/15.
 */

///<reference path="../math/Math.ts"/>
///<reference path="../core/EventDispatcher.ts" />

namespace HEY{

    export class Texture extends EventDispatcher{


        uuid:string = null;

        version:number = 0;


        image:HTMLImageElement = null;

        format:number = RGBAFormat;

        type:number = UnsignedByteType;


        wrapS:number = RepeatWrapping;
        wrapT:number = RepeatWrapping;
        magFilter:number =  LinearFilter;
        minFilter:number =  LinearMipMapLinearFilter;

        anisotropy:number = 1;
        flipY:boolean = true;
        generateMipmaps = true;
        premultiplyAlpha = false;
        unpackAlignment = 4;	//


        constructor(){
            super();
            this.uuid = _Math.generateUUID();

        }

        set needsUpdate(val:boolean){
            if(val === true) this.version ++;
        }



    }

}