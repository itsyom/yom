/**
 * Created by ll on 2017/5/27.
 */

namespace HEY{

    import Vector4 = THREE.Vector4;
    export class WGLRenderTarget extends EventDispatcher{

        uuid:string = _Math.generateUUID();

        width:number = 0;
        height:number = 0;
        viewport:Vector4 = null;

        texture:Texture = null;
        depthTexture:Texture = null;

        depthBuffer:boolean = true;
        stencilBuffer:boolean = true;

        constructor(width:number,height:number,options:any = {}){
            super();

            this.width = width;
            this.height = height;
            this.viewport = new Vector4(0,0,width,height);

            this.texture = new Texture();

            this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer:true;
            this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilbuffer:true;
            this.depthTexture = options.depthTexture !== undefined ? options.depthTexture:null;

            if(this.depthTexture){
                this.depthTexture.image.width = width;
                this.depthTexture.image.height = height;
            }
        }

        getSize(){
            return [this.width,this.height];
        }

        clone(){
            let ins = new WGLRenderTarget(this.width,this.height);

            ins.depthBuffer = this.depthBuffer;
            ins.stencilBuffer = this.stencilBuffer;
            ins.depthTexture = this.depthTexture;
            return ins;
        }


    }

}