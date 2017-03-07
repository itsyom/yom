/**
 * Created by ll on 2017/3/1.
 */

/// <reference path = "../node_modules/@types/three/index.d.ts" />

namespace HEY{

    import Matrix4 = THREE.Matrix4;
    export class Rectangle{

        program:WebGLProgram = null;
        vao:number = null;

        texture:WebGLTexture = null;

        gl:WebGLRenderingContext = null;

        translate_matrix:Matrix4 = null;

        deltaX:number = 0;

        loc_model:number = -1;
        loc_view:number = -1;
        loc_projection:number = -1;

        loc_texture:number = -1;

        rotation_matrix:Matrix4 = new Matrix4();
        scale_matrix:Matrix4 = new Matrix4();

        constructor(){
            let gl = Scene.gl;

            let vertices = new Float32Array([
                //position     //colors        //uvs
                -20,20,0,    100.0,0.,0.,     0.,1.,
                -20,-20,0,   0.,100.,0.,      0.,0.,
                20,20,0,     0.,0.,1.,      1.,1.,
                20,-20,0 ,    100.,100., 0.,    1.,0.,

                -20,20,40,    100.0,0.,0.,     0.,1.,
                -20,-20,40,   0.,100.,0.,      0.,0.,
                20,20,40,     0.,0.,1.,      1.,1.,
                20,-20,40 ,    100.,100., 0.,    1.,0.,

            ]);

            let indices = new Uint16Array([
                0,1,2,
                2,1,3,
                // 4,5,7,
                // 4,7,6,
                // 4,1,5,
                // 0,1,4,
                // 6,7,3,
                // 2,6,3,
                // 2,0,4,
                // 2,4,6,
                // 1,5,7,
                // 1,7,3
            ]);

            let ebo = gl.createBuffer();
            let vbo = gl.createBuffer();
            
            let vao = gl.createVertexArray();
            gl.bindVertexArray(vao);

            gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
            gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ebo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
            
            gl.vertexAttribPointer(0,3,gl.FLOAT,false,8*Float32Array.BYTES_PER_ELEMENT,0);
            gl.enableVertexAttribArray(0);

            gl.vertexAttribPointer(1,3,gl.FLOAT,false,8*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(1);

            gl.vertexAttribPointer(2,2,gl.FLOAT,false,8*Float32Array.BYTES_PER_ELEMENT,6*Float32Array.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(2);



            gl.bindVertexArray(null);

            gl.bindBuffer(gl.ARRAY_BUFFER,null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);

            //init textures
            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D,texture);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);

            let data = new Uint8Array([255,0,255,255]);

            let image = document.createElement("img");
            image.src = "../asset/wall.jpg";
            image.onload = function(data:any){
                gl.bindTexture(gl.TEXTURE_2D,texture);
                gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,data.target);
            }

            gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,data);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.bindTexture(gl.TEXTURE_2D,null);

            this.texture = texture;


            let shader = new Shader(ShaderLib.v_rectangle,ShaderLib.f_rectangle);

            this.program = shader.getWebglProgram();
            this.vao = vao;

            this.gl = gl;

            this.translate_matrix = new THREE.Matrix4();

            this.loc_model = gl.getUniformLocation(this.program,"model");
            this.loc_view = gl.getUniformLocation(this.program,"view");
            this.loc_projection = gl.getUniformLocation(this.program,"projection");

            this.loc_texture = gl.getUniformLocation(this.program,"ourTexture");

        }

        render(  ){
            let gl:any = this.gl;

            gl.useProgram(this.program);

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D,this.texture);
            let loc = this.loc_texture;
            gl.uniform1i(loc,1);

            this.deltaX += 0.01;
            let loc_transform = this.loc_model;
            gl.uniformMatrix4fv(loc_transform,false,this.translate_matrix.clone().multiply(this.rotation_matrix)
                .multiply(this.scale_matrix).elements);

            let viewMatrix = new THREE.Matrix4();
            viewMatrix.makeTranslation(0,0,-100);
            gl.uniformMatrix4fv(this.loc_view,false,viewMatrix.elements);

            let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
            let projectionMatrix = camera.projectionMatrix;
            gl.uniformMatrix4fv(this.loc_projection,false,projectionMatrix.elements);

            gl.bindVertexArray(this.vao);
            gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);

            gl.bindVertexArray(null);
        }


    }
}