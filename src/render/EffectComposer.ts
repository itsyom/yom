/**
 * Created by ll on 2017/5/31.
 */


namespace HEY{

    import randFloatSpread = THREE.Math.randFloatSpread;
    export class EffectComposer{

        passes:Pass[] = [];

        renderer:WebGL2Renderer = null;

        renderTarget1:WGLRenderTarget = null;
        renderTarget2:WGLRenderTarget = null;

        readBuffer:WGLRenderTarget = null;
        writeBuffer:WGLRenderTarget = null;

        constructor(renderer:WebGL2Renderer,renderTarget:WGLRenderTarget){
            this.renderer = renderer;
            if(renderTarget === undefined){
                let [w,h] = renderer.getSize();
                this.renderTarget1 = new WGLRenderTarget(w,h);
            }else{
                this.renderTarget1 = renderTarget;
            }
            this.renderTarget2 = this.renderTarget1.clone();

            this.readBuffer = this.renderTarget1;
            this.writeBuffer = this.renderTarget2;
        }

        addPass(pass:Pass){
            if(pass){
                this.passes.push(pass);
            }
        }

        render(){
            let pass:Pass = null;
            for(let i = 0,l = this.passes.length; i < l; i++){
                pass = this.passes[i];
                pass.render(this.renderer,this.writeBuffer,this.readBuffer);

                if(pass.needsSwap){
                    this.swapBuffer();
                }
            }
        }


        swapBuffer(){

            let temp = this.readBuffer;
            this.readBuffer = this.writeBuffer;
            this.writeBuffer = temp;

        }


    }


}