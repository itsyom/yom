/**
 * Created by ll on 2017/3/1.
 */

///<reference path="./render/WebGL2Renderer.ts" />
namespace HEY.Demo{
    import Camera = THREE.Camera;
    import Vector3 = THREE.Vector3;
    export let gl:any = null;

    export let renderer:WebGL2Renderer = null;

    export let camera:PerspectiveCamera = null;

    let delta:number = 0;

    let children:any[] = [];

    let frameBuffer:WebGLFramebuffer = null;

    let screenRectangle:RectangleScreen = null;

    let screenTexture:WebGLTexture = null;

    let skybox:Skybox = null;

    export function init(){
        let  canvas = document.getElementById("render_canvas") as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        renderer = new WebGL2Renderer({canvas:canvas});
        gl = renderer.gl;

        camera = new PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,500);
        camera.lookAt(new Vector3(0,0,10),new Vector3(0,0,-0),new Vector3(0,1,0));

        let rectangle = new HEY.Rectangle( );
        rectangle.matrix_rotation.makeRotationX(Math.PI/2);
        rectangle.matrix_translate.makeTranslation(0,-30,-0);
        rectangle.matrix_scale.makeScale(10,30,10);
        children.push(rectangle);

        let box = new HEY.Box();
        box.matrix_scale.makeScale(10,10,10);
        box.matrix_translate.makeTranslation(0,0,-100);
        children.push(box);

        let box1 = new HEY.Box();
        box1.matrix_scale.makeScale(10,10,10);
        box1.matrix_translate.makeTranslation(-20,0,-100);
        // children.push(box1);

        let flatBox = new HEY.FlatBox();
        flatBox.matrix_scale.makeScale(10.5,10.5,10.5);
        flatBox.matrix_translate.makeTranslation(0,0,-100);
        // children.push(flatBox);

        // initFrameBuffer();

        // screenRectangle = new RectangleScreen();
        // screenRectangle.setTexture(screenTexture,0);

        initSkybox();
    }

    function initSkybox(){
        skybox = new Skybox();
        // skybox.matrix_scale.makeScale(300,300,300);

    }

    function initFrameBuffer(){
        frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER,frameBuffer);

        screenTexture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D,screenTexture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,window.innerWidth,window.innerHeight,0,gl.RGB,gl.UNSIGNED_BYTE,null);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);

        gl.bindTexture(gl.TEXTURE_2D,null);

        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,screenTexture,0);

        let rbo = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER,rbo);
        gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH24_STENCIL8,window.innerWidth,window.innerHeight);
        gl.bindRenderbuffer(gl.RENDERBUFFER,null);

        gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_STENCIL_ATTACHMENT,gl.RENDERBUFFER,rbo);

        if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE){
            console.log("framebuffer is not complete");
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER,null );
    }

    function checkEvents(){
        if(camera){
            camera.update();
        }

    }

    export function render(){
        beforeRender();

        for(let i = 0;i < children.length;i++){
            children[i].render();
        }
    }

    export function stencil_test(){
        checkEvents();

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.STENCIL_TEST);
        gl.clearColor(.2,.3,.4,1.);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT);

        children[0].render();
        gl.stencilFunc(gl.ALWAYS,1,0xff);
        gl.stencilOp(gl.KEEP,gl.KEEP,gl.REPLACE);
        gl.stencilMask(0x00);

        gl.stencilMask(0xff);
        children[1].render();

        gl.stencilMask(0x00);
        gl.stencilFunc(gl.NOTEQUAL,1,0xff);
        children[2].render();

        gl.stencilMask(0xff);

    }

    function beforeRender(){
        gl.enable(gl.DEPTH_TEST);
        // gl.clearColor(.2,.3,.4,1);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        delta += 0.01;
        checkEvents();
    }

    export function frameBuffer_test(){
        gl.bindFramebuffer(gl.FRAMEBUFFER,frameBuffer);

        render( );

        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        gl.clearColor(1.,1.,1.,1.);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.DEPTH_TEST);

        screenRectangle.render();
    }

    export function skybox_test(){
        beforeRender();


        for(let i = 0;i < children.length;i++){
            children[i].render();
        }
        skybox.render();
    }

    export let render_new:any;

    export function testNew(){
        let  canvas = document.getElementById("render_canvas") as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let render = new WebGL2Renderer({canvas:canvas});
        GL.gl = render.gl;

        let gl = GL.gl;

        let geometry = new GeometryBuffer();

        let vertices = new Float32Array([
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0,
            0.0,  0.5, 0.0
        ]);

        let indices = new Int16Array([
            0,1,2
        ]);
        geometry.attributes["position"] = new VertexAttribute(vertices,3,gl.FLOAT);
        geometry.attributes["index"] = new IndexAttribute(indices,3,gl.UNSIGNED_SHORT);

        let material = new ShaderMaterial(ShaderLib.v_default,ShaderLib.f_default,{
            col: new Float32Array([1,1,0])
        });

        WGLRenderList.getInstance().add(new RenderItem(geometry,material));

        render_new = function(){
            render.render();
        }

    }

}