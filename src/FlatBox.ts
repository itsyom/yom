/**
 * Created by ll on 2017/3/8.
 */

namespace HEY{

    export class FlatBox extends Box{
        constructor(){
            super();
            this.init();
        }

        initTextures(){

        }

        initProgram(){
            let gl = Demo.gl;
            let shader = new Shader(ShaderLib.v_box,ShaderLib.f_flat);
            this.program = shader.getWebglProgram();

            this.loc_model = gl.getUniformLocation(this.program,"model");
            this.loc_view = gl.getUniformLocation(this.program,"view");
            this.loc_projection = gl.getUniformLocation(this.program,"projection");
        }

        render(){
            let gl = Demo.gl;
            gl.useProgram(this.program);

            this.deltaX += 0.01;

            gl.uniformMatrix4fv(this.loc_model,false,this.getMatrixModel());

            let matrix_view = Demo.camera.matrix_view.clone();
            matrix_view.getInverse(matrix_view);
            gl.uniformMatrix4fv(this.loc_view,false,matrix_view.elements);

            let camera = Demo.camera;
            let matrix_projection = camera.matrix_projection;
            gl.uniformMatrix4fv(this.loc_projection,false,matrix_projection.elements);

            gl.bindVertexArray(this.vao);
            gl.drawArrays(gl.TRIANGLES,0,36);

            gl.bindVertexArray(null);
        }


    }
}