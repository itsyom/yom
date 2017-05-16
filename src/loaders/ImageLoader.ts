/**
 * Created by ll on 2017/5/16.
 */

namespace HEY{

    export class ImageLoader{


        constructor(){


        }


        load(url:string,onLoad:any,onError:any){

            let image = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'img' );

            image.addEventListener( 'load',  function(){

                if ( onLoad ) onLoad( this );

            }, false );

            image.addEventListener( 'error', function ( event ) {
                if ( onError ) onError( event );
            }, false );

            any(image).src = url;

            return image as HTMLImageElement;
        }

    }

}