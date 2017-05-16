/**
 * Created by hey on 2017/5/14.
 */

namespace HEY{


    export class WGLRenderList{

        private static instance:WGLRenderList = null;

        items:RenderItem[] = [];

        constructor(){

        }

        static getInstance(){
            if(WGLRenderList.instance === null){
                WGLRenderList.instance = new WGLRenderList();
            }
            return WGLRenderList.instance;
        }

        add(item:RenderItem){
            if(item){
                this.items.push(item);
            }
        }

        clear(){
            this.items.length = 0;
        }

    }


}