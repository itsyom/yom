/**
 * Created by ll on 2017/3/1.
 */

///<reference path="./WebGL2Renderer.ts" />
namespace HEY.Scene{
    import Camera = THREE.Camera;
    import Vector3 = THREE.Vector3;
    export let gl:any = null;

    export let camera:PerspectiveCamera = null;

    let delta:number = 0;

    let children:any[] = [];

    export function init(){
        let  canvas = document.getElementById("render_canvas") as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let renderer = new WebGL2Renderer({canvas:canvas});
        gl = renderer.gl;

        camera = new PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,500);
        camera.lookAt(new Vector3(0,0,10),new Vector3(0,0,-0),new Vector3(0,1,0));

        let rectangle = new HEY.Rectangle();
        rectangle.matrix_rotation.makeRotationX(Math.PI/2);
        rectangle.matrix_translate.makeTranslation(0,-30,-0);
        rectangle.matrix_scale.makeScale(10,10,10);
        children.push(rectangle);

        let box = new HEY.Box();
        box.matrix_scale.makeScale(10,10,10);
        box.matrix_translate.makeTranslation(0,0,-100);
        children.push(box);

        let box1 = new HEY.Box();
        box1.matrix_scale.makeScale(10,10,10);
        box1.matrix_translate.makeTranslation(-20,0,-100);
        // children.push(box1);

    }

    function checkEvents(){
        if(camera){
            camera.update();
        }

    }

    export function render(){
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(1,1,1,1);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        delta += 0.01;

        checkEvents();

        for(let i = 0;i < children.length;i++){
            children[i].render();
        }
    }

}