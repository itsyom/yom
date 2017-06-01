/**
 * Created by ll on 2017/5/15.
 */

///<reference path="../math/Math.ts"/>
///<reference path="../core/EventDispatcher.ts" />

namespace HEY{

    export class Texture extends EventDispatcher{

        uuid:string = null;

        version:number = 0;

        image:HTMLImageElement|{width:number,height:number} = null;

        format:string = RGBAFormat;

        type:string = UnsignedByteType;

        wrapS:string = RepeatWrapping;
        wrapT:string = RepeatWrapping;
        magFilter:string =  LinearFilter;
        minFilter:string =  LinearMipMapLinearFilter;

        flipY:boolean = true;
        generateMipmaps = true;
        anisotropy:number = 1;
        premultiplyAlpha = false;
        unpackAlignment = 4;	//


        constructor(image:HTMLImageElement = null,options:any = null){
            super();
            this.uuid = _Math.generateUUID();

            this.image = image;
            options = options || {};
            this.magFilter = options.magFilter || this.magFilter;
            this.minFilter = options.minFilter || this.minFilter;
            this.wrapS = options.wrapS || RepeatWrapping;
            this.wrapT = options.wrapT || RepeatWrapping;
        }

        set needsUpdate(val:boolean){
            if(val === true) this.version ++;
        }

        dispose(){
            this.dispatchEvent({type:"dispose"});
        }

    }

}