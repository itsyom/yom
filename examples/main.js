/**
 * Created by hey on 2017/2/28.
 */

var scene = HEY.Demo;

// HEY.Demo.init();
// HEY.Demo.testNew();

init();

animate();

function init(){

}

function animate() {
    requestAnimationFrame(animate);
    // HEY.Scene.render();
    // scene.stencil_test();
    // scene.frameBuffer_test();

    // scene.render_new();
}


function testFileLoader(){

    HEY.FileLoader.load("main.js",function(data){
        console.log("response: ",data);
    });
}
// testFileLoader();

function testModels(){

    var  canvas = document.getElementById("render_canvas") as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var render = new HEY.WebGL2Renderer({canvas:canvas});





}


