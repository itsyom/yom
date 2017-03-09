/**
 * Created by hey on 2017/2/28.
 */

var scene = HEY.Scene;

HEY.Scene.init();
animate();

function animate() {
    requestAnimationFrame(animate);
    // HEY.Scene.render();
    // scene.stencil_test();
    scene.frameBuffer_test();
}



