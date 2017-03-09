/**
 * Created by ll on 2017/3/9.
 */

namespace HEY{
    export class RectangleScreen extends Object3D{

        vertices = new Float32Array([
            -1,1,0,  0,1,
            -1,-1,0, 0,0,

            1,1,0, 1,1,
            1,-1,0, 1,0

        ]);

        indexes = new Uint8Array([
            0,1,2,
            2,1,3
        ]);

        constructor(){
            super();

            this.init();
        }

        getVertices(){
            return new Float32Array([
                -1,1,0,  0,1,
                -1,-1,0, 0,0,

                1,1,0, 1,1,
                1,-1,0, 1,0

            ]);
        }

        getIndexes(){
            return new Uint8Array([
                0,1,2,
                2,1,3
            ]);
        }

        initVAO(){
            let gl = Scene.gl;

            let vao = gl.createVertexArray();
            let vbo = gl.createBuffer();
            let ibo = gl.createBuffer();

            gl.bindVertexArray(vao);
            gl.bindBuffer(gl.ARRAY_BUFFER,vbo);

            gl.bufferData(gl.ARRAY_BUFFER,this.getVertices(),gl.STATIC_DRAW);
            gl.vertexAttribPointer(0,3,gl.FLOAT,false,5*4,0);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(1,2,gl.FLOAT,false,5*4,3*4);
            gl.enableVertexAttribArray(1);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,this.getIndexes(),gl.STATIC_DRAW);

            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER,null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);

            this.vao = vao;
        }

        initTextures(){

        }



        initProgram(){
            let gl = Scene.gl;
            let shader = new Shader(ShaderLib.v_screen,ShaderLib.f_screen);
            this.program = shader.getWebglProgram();

            let locTexture0 = gl.getUniformLocation(this.program,"texture0");
            this.loc_textures.push(locTexture0);

            this.shader = shader;
        }

        render(){
            let gl = Scene.gl;
            this.shader.use();
            gl.uniform1i(this.loc_textures[0],0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D,this.textures[0]);

            gl.bindVertexArray(this.vao);

            gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_BYTE,0);

            gl.bindVertexArray(null);
            // gl.bindTexture(gl.TEXTURE_2D,null);
        }

    }
}