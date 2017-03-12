/**
 * Created by hey on 2017/3/12.
 */

namespace HEY{

    export class Skybox extends Object3D{

        static vertices = new Float32Array([
            // Positions
            -1.0,  1.0, -1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,

            -1.0, -1.0,  1.0,
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0,  1.0,

            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,

            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,

            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0
        ]);

        constructor(){
            super();
            this.init();
        }

        loadCubeMap(face:string[]){
            let gl:WebGLRenderingContext = Scene.gl;
            let textureId:WebGLTexture = null;
            textureId = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP,textureId);

            let data = new Uint8Array([255,0,255]);
            for(let i = 0;i < face.length;i++){
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,gl.RGB,1,1,0,gl.RGB,gl.UNSIGNED_BYTE,data);
                let image = new Image();
                image.src = "../asset/skybox/"+face[i];
                image.onload = (function(i:number){
                    return function(data:any){
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP,textureId);
                        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,data.target);
                    }
                })(i)
            }

            gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER,gl.LINEAR);

            gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP,(gl as any).TEXTURE_WRAP_R,gl.CLAMP_TO_EDGE);

            gl.bindTexture(gl.TEXTURE_CUBE_MAP,null);
            return textureId;
        }

        initVAO(){
            let gl:WebGLRenderingContext = Scene.gl;
            let vao = (gl as any).createVertexArray();
            let vbo = gl.createBuffer();

            (gl as any).bindVertexArray(vao);
            gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
            gl.bufferData(gl.ARRAY_BUFFER,Skybox.vertices,gl.STATIC_DRAW);
            // gl.bufferData(gl.ARRAY_BUFFER,Box.vertices,gl.STATIC_DRAW);
            gl.vertexAttribPointer(0,3,gl.FLOAT,false,3*4,0);
            gl.enableVertexAttribArray(0);

            (gl as any).bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER,null);

            this.vao = vao;
        }

        initTextures(){
            let faces = ["right.jpg","left.jpg","top.jpg","bottom.jpg","back.jpg","front.jpg"];
            this.textures[0] = this.loadCubeMap(faces);
        }

        initProgram(){
            let gl = Scene.gl;
            this.shader = new Shader(ShaderLib.v_skybox,ShaderLib.f_skybox);

            this.program = this.shader.getWebglProgram();
            this.loc_textures[0] = gl.getUniformLocation(this.program,"skybox");
            this.loc_projection = gl.getUniformLocation(this.program,"projection");
            this.loc_view = gl.getUniformLocation(this.program,"view");
        }

        render(){
            let gl:WebGLRenderingContext = Scene.gl;
            // gl.disable(gl.CULL_FACE);
            this.shader.use();
            // gl.depthMask(false);

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP,this.textures[0]);
            gl.uniform1i(this.loc_textures[0],1);

            gl.uniformMatrix4fv(this.loc_projection,false,Scene.camera.matrix_projection.elements);
            gl.uniformMatrix4fv(this.loc_view,false,Scene.camera.matrix_view.getInverse(Scene.camera.matrix_view).elements);

            (gl as any).bindVertexArray(this.vao);

            gl.drawArrays(gl.TRIANGLES,0,3);

            // (gl as any).bindVertexArray(null);
            // gl.bindTexture(gl.TEXTURE_CUBE_MAP,null);
            gl.depthMask(true);

        }


    }

}