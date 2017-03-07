/**
 * Created by ll on 2017/3/6.
 */

/// <reference path="./Object3D.ts" />
namespace HEY{

    import Matrix4 = THREE.Matrix4;
    let vertices = new Float32Array([
        -0.5, -0.5, -0.5,  0.0, 0.0,
        0.5, -0.5, -0.5,  1.0, 0.0,
        0.5,  0.5, -0.5,  1.0, 1.0,
        0.5,  0.5, -0.5,  1.0, 1.0,
        -0.5,  0.5, -0.5,  0.0, 1.0,
        -0.5, -0.5, -0.5,  0.0, 0.0,

        -0.5, -0.5,  0.5,  0.0, 0.0,
        0.5, -0.5,  0.5,  1.0, 0.0,
        0.5,  0.5,  0.5,  1.0, 1.0,
        0.5,  0.5,  0.5,  1.0, 1.0,
        -0.5,  0.5,  0.5,  0.0, 1.0,
        -0.5, -0.5,  0.5,  0.0, 0.0,

        -0.5,  0.5,  0.5,  1.0, 0.0,
        -0.5,  0.5, -0.5,  1.0, 1.0,
        -0.5, -0.5, -0.5,  0.0, 1.0,
        -0.5, -0.5, -0.5,  0.0, 1.0,
        -0.5, -0.5,  0.5,  0.0, 0.0,
        -0.5,  0.5,  0.5,  1.0, 0.0,

        0.5,  0.5,  0.5,  1.0, 0.0,
        0.5,  0.5, -0.5,  1.0, 1.0,
        0.5, -0.5, -0.5,  0.0, 1.0,
        0.5, -0.5, -0.5,  0.0, 1.0,
        0.5, -0.5,  0.5,  0.0, 0.0,
        0.5,  0.5,  0.5,  1.0, 0.0,

        -0.5, -0.5, -0.5,  0.0, 1.0,
        0.5, -0.5, -0.5,  1.0, 1.0,
        0.5, -0.5,  0.5,  1.0, 0.0,
        0.5, -0.5,  0.5,  1.0, 0.0,
        -0.5, -0.5,  0.5,  0.0, 0.0,
        -0.5, -0.5, -0.5,  0.0, 1.0,

        -0.5,  0.5, -0.5,  0.0, 1.0,
        0.5,  0.5, -0.5,  1.0, 1.0,
        0.5,  0.5,  0.5,  1.0, 0.0,
        0.5,  0.5,  0.5,  1.0, 0.0,
        -0.5,  0.5,  0.5,  0.0, 0.0,
        -0.5,  0.5, -0.5,  0.0, 1.0
    ]);

    export class Box extends Object3D{

        webgl_texture:WebGLTexture = null;

        program:WebGLProgram = null;

        vao:number = null;

        loc_texture:number = -1;

        loc_model:number = -1;
        loc_view:number = -1;
        loc_projection:number = -1;

        deltaX:number = 0;

        constructor( ){
            super();
            this.initVAO();
            this.initTextures();
            this.initProgram();
        }

        initVAO(){
            let gl = Scene.gl;

            let vao = gl.createVertexArray();
            let vbo = gl.createBuffer();

            gl.bindVertexArray(vao);
            gl.bindBuffer(gl.ARRAY_BUFFER,vbo);

            gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
            gl.vertexAttribPointer(0,3,gl.FLOAT,false,5*4,0);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(1,2,gl.FLOAT,false,2*4,3*4);
            gl.enableVertexAttribArray(1);

            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER,null);

            this.vao = vao;

        }

        initTextures(){
            let gl = Scene.gl;
            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D,texture);

            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);

            let data = new Uint8Array([255,0,255,255]);
            let image = document.createElement("img");
            image.src = "../asset/wall.jpg";
            image.onload = function(data:any){
                gl.bindTexture(gl.TEXTURE_2D,texture);
                gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,data.target);
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,data);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.bindTexture(gl.TEXTURE_2D,null);
            this.webgl_texture = texture;
        }

        initProgram(){
            let gl = Scene.gl;
            let shader = new Shader(ShaderLib.v_box,ShaderLib.f_box);
            this.program = shader.getWebglProgram();

            this.loc_texture = gl.getUniformLocation(this.program,"ourTexture");
            this.loc_model = gl.getUniformLocation(this.program,"model");
            this.loc_view = gl.getUniformLocation(this.program,"view");
            this.loc_projection = gl.getUniformLocation(this.program,"projection");

        }

        render( ){
            let gl = Scene.gl;
            gl.useProgram(this.program);

            this.deltaX += 0.01;

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D,this.webgl_texture);
            gl.uniform1i(this.loc_texture,0);

            gl.uniformMatrix4fv(this.loc_model,false,this.getMatrixModel());

            let matrix_view = Scene.camera.matrix_view.clone();
            matrix_view.getInverse(matrix_view);
            gl.uniformMatrix4fv(this.loc_view,false,matrix_view.elements);

            let camera = Scene.camera;
            let matrix_projection = camera.matrix_projection;
            gl.uniformMatrix4fv(this.loc_projection,false,matrix_projection.elements);

            gl.bindVertexArray(this.vao);
            gl.drawArrays(gl.TRIANGLES,0,36);

            gl.bindVertexArray(null);
            gl.bindTexture(gl.TEXTURE_2D,null);
        }



    }

}