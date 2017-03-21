/**
 * Created by hey on 2017/2/28.
 */

var scene = HEY.Demo;

HEY.Demo.init();
animate();

function animate() {
    requestAnimationFrame(animate);
    // HEY.Scene.render();
    // scene.stencil_test();
    // scene.frameBuffer_test();

    scene.skybox_test();
}



