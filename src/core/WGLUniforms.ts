/**
 * Created by hey on 2017/5/13.
 */

namespace HEY{

    export class WGLUniform{
        type:number = null;
        loc:WebGLUniformLocation = -1;

        id:string = null;
        constructor(id:string,loc:WebGLUniformLocation,type:number){
            this.id = id;
            this.loc = loc;
            this.type = type;
        }

        setValue(value:any){

        }
    }

    export class WGLUniforms{

        map:{[key:string]:WGLUniform} = {};
        constructor(program:WebGLProgram){

            let gl = GL.gl;
            var n = gl.getProgramParameter( program, gl.ACTIVE_UNIFORMS );

            for ( var i = 0; i < n; ++ i ) {

                var info = gl.getActiveUniform( program, i ),
                    path = info.name,
                    addr = gl.getUniformLocation( program, path );

                this.addUniform(new WGLUniform(path,addr,info.type));
            }

        }

        addUniform(uniform:WGLUniform){
            if(uniform){
                this.map[uniform.id] = uniform;
            }
        }

        load(){

        }
    }




}