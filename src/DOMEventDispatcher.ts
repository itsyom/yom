/**
 * Created by hey on 2017/3/25.
 */

namespace HEY{
    export class DOMEventDispatcher{

        private static instance:DOMEventDispatcher = null;

        listeners:EventListener[] = [];

        private constructor(){

        }

        static getInstance(){
            if(DOMEventDispatcher.instance === null){
                DOMEventDispatcher.instance = new DOMEventDispatcher();
            }
            return DOMEventDispatcher.instance;
        }

        setup(){
            let canvas = Demo.renderer.domElement;
            if(canvas){
                canvas.addEventListener("mousedown",this.onMouseDown,false);
                canvas.addEventListener("mousemove",this.onMouseMove,false);
                canvas.addEventListener("mouseup",this.onMouseUp,false);
            }
        }

        addEventListener(listener:EventListener){
            if(listener && this.listeners.indexOf(listener) == -1){
                this.listeners.push(listener);
            }
        }

        onMouseDown(e:MouseEvent){
            for(let i = 0;i < this.listeners.length;i++){
                this.listeners[i].onMouseDown(e);
            }
        }

        onMouseMove(e:MouseEvent){
            for(let i = 0;i < this.listeners.length;i++){
                this.listeners[i].onMouseMove(e);
            }
        }

        onMouseUp(e:MouseEvent){
            for(let i = 0;i < this.listeners.length;i++){
                this.listeners[i].onMouseUp(e);
            }
        }



    }
}