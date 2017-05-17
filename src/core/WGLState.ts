/**
 * Created by ll on 2017/5/16.
 */


namespace HEY{

    let gl:WebGLRenderingContext = null;
    export class WGLState{

        constructor(){

            gl = GL.gl;
        }

        setMaterial(material:ShaderMaterial){
            gl.enable(gl.DEPTH_TEST);


        }


    }

}