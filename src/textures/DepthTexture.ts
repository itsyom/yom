/**
 * Created by ll on 2017/5/27.
 */

namespace HEY{


    export class DepthTexture extends Texture{

        constructor(width:number = 0,height:number = 0){
            super();

            this.generateMipmaps = false;
            this.flipY = false;

            this.image = {width:width,height:height};
        }

    }

}