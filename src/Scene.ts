/**
 * Created by ll on 2017/3/1.
 */

///<reference path="./WebGL2Renderer.ts" />
namespace HEY.Scene{
    export let gl:any = null;

    let triangle:Triangle = null;
    let rectangle:Rectangle = null;

    let box:Box = null;

    let children:any[] = [];

    export function init(){
        let  canvas = document.getElementById("render_canvas") as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let renderer = new WebGL2Renderer({canvas:canvas});
        gl = renderer.gl;

        rectangle = new HEY.Rectangle();
        rectangle.rotation_matrix.makeRotationX(Math.PI/2);
        rectangle.translate_matrix.makeTranslation(0,-0,0);
        rectangle.scale_matrix.makeScale(10,10,10);
        children.push(rectangle);

        box = new HEY.Box();
        box.matrix_translate.makeTranslation(0,0,0);
        children.push(box);

        let box1 = new HEY.Box();
        box1.matrix_translate.makeTranslation(-30,0,0);
        children.push(box1);
    }

    export function render(){
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(1,1,1,1);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        for(let i = 0;i < children.length;i++){
            children[i].render();
        }
    }

}