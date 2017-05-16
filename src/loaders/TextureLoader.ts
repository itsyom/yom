/**
 * Created by ll on 2017/5/15.
 */

namespace HEY{

    export class TextureLoader{
        constructor(){

        }

        load(url:string,onLoad:any,onError:any = null){

            let texture:Texture = new Texture();
            let loader = new ImageLoader();

            texture.image = loader.load(url,()=>{
                // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
                var isJPEG = url.search( /\.(jpg|jpeg)$/ ) > 0 || url.search( /^data\:image\/jpeg/ ) === 0;

                texture.format = isJPEG ? RGBFormat : RGBAFormat;
                texture.needsUpdate = true;

                if(onLoad){
                    onLoad(texture);
                }

            },onError);

            return texture;
        }

    }
}