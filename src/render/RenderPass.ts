/**
 * Created by ll on 2017/5/31.
 */

namespace HEY{


    import Camera = THREE.Camera;
    export class Pass{


        needsSwap:boolean = false;

        constructor(){
        }


        render(render:WebGL2Renderer,writeBuffer:WGLRenderTarget,readBuffer:WGLRenderTarget){

        }

    }


    export class RenderPass extends Pass{

        scene:Scene = null;
        camera:Camera = null;

        constructor(scene:Scene,camera:Camera){
            super();

            this.scene = scene;
            this.camera = camera;
        }

        render(renderer:WebGL2Renderer,writeBuffer:WGLRenderTarget,readBuffer:WGLRenderTarget){
            renderer.render(this.scene,this.camera,readBuffer);
        }

    }


}