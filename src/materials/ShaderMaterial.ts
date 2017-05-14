/**
 * Created by ll on 2017/5/12.
 */


namespace HEY{

    export class ShaderMaterial{

        vs:string = null;
        fs:string = null;
        uniforms:{[key:string]:any} = null;

        program:WGLProgram = null;

        constructor(vs:string,fs:string,unforms:{[key:string]:any}){
            this.vs = vs;
            this.fs = fs;
            this.uniforms = unforms;
        }

        getProgram(){
            return this.program;
        }

    }
}