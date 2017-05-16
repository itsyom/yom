/**
 * Created by ll on 2017/5/12.
 */


namespace HEY{

    export class ShaderMaterial{

        vs:string = null;
        fs:string = null;

        program:WGLProgram = null;

        constructor(vs:string,fs:string,parameters:any = null){
            this.vs = vs;
            this.fs = fs;
            this.setValues(parameters);
        }

        setValues(parameters:any){
            if(!parameters) return;

            for(let name in parameters){
                let _this:any = this;
                _this[name] = parameters[name];
            }
        }

        getProgram(){
            return this.program;
        }

    }
}