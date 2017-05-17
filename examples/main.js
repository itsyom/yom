/**
 * Created by hey on 2017/2/28.
 */



var renderer = null;
var scene,camera;
init();

animate();

function init(){
    testModels();
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene,camera);
}


function testFileLoader(){

    HEY.FileLoader.load("main.js",function(data){
        console.log("response: ",data);
    });
}
// testFileLoader();

function testModels(){

    var  canvas = document.getElementById("render_canvas") ;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer = new HEY.WebGL2Renderer({canvas:canvas,antialias:true});
    scene = new HEY.Scene();
    camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,10000);
    camera.position.z = 20;
    camera.position.y = 8;
    var gl = HEY.GL.gl;

    var geometry = new HEY.GeometryBuffer();

    var vertices = new Float32Array([
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        0.0,  0.5, 0.0
    ]);

    var indices = [
        0,1,2
    ];
    geometry.attributes["position"] = new HEY.VertexAttribute(vertices,3,gl.FLOAT);
    geometry.setIndex(indices);

    var material = new HEY.ShaderMaterial(HEY.ShaderLib.v_default,HEY.ShaderLib.f_default,{
        col: new Float32Array([1,1,0])
    });

    var triangle = new HEY.Mesh(geometry,material);
    // scene.add(triangle );

    triangle.transform.scale.set(100,100,100);

    var assimpLoader = new HEY.AssimpJSONLoader();
    assimpLoader.load("../asset/nanosuit/nanosuit.json",function(obj){
        obj.transform.scale.set(2,2,2);
        obj.transform.postition.y = -15;
        scene.add(obj);
    })

    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 10;
    controls.maxDistance = 7500;


}


