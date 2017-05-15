/**
 * Created by ll on 2017/5/15.
 */

namespace HEY{

    export class FileLoader{

        constructor(){

        }

        static load(url:string ,onLoad:any,onError:any = null,onProgress:any = null){

            var request = new XMLHttpRequest();
            request.open( 'GET', url, true );

            request.addEventListener( 'load', function ( event:any ) {
                var response = event.target.response;

                if(this.status == 200){
                    onLoad(response);
                }else{
                    if(onError){
                        onError();
                    }
                }

            });

            request.send(null);
        }

    }

}