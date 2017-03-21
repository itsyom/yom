/**
 * Created by ll on 2017/3/1.
 */
namespace HEY{

    export interface ShaderInfo{
        attribute:{[key:string]:number},

        uniform?:{[key:string]:number}
    }

    export class Shader{
        program:WebGLProgram = null;

        shaderInfo:ShaderInfo = null;

        constructor(v:string,f:string,param:ShaderInfo = null){
            this.shaderInfo = param;
            this.init(v,f);
        }

        init(v:string,f:string){
            let gl = Demo.gl;

            let vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader,v);
            gl.compileShader(vertexShader);

            let succ = gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS);
            if(!succ){
                let log = gl.getShaderInfoLog(vertexShader);
                console.log("compile shader error:",log);
                return ;
            }

            let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader,f);
            gl.compileShader(fragmentShader);

            succ = gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS);
            if(!succ){
                let log = gl.getShaderInfoLog(fragmentShader);
                console.log(log);
                return;
            }

            let program = gl.createProgram();
            gl.attachShader(program,vertexShader);
            gl.attachShader(program,fragmentShader);

            if(this.shaderInfo){
                let attribute = this.shaderInfo.attribute;
                for(let key in attribute){
                    gl.bindAttribLocation(program,attribute[key],key);
                }
            }

            gl.linkProgram(program);

            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader );

            succ = gl.getProgramParameter(program,gl.LINK_STATUS);
            if(!succ){
                let log = gl.getProgramInfoLog(program);
                console.log(log);
                return;
            }

            this.program = program;

            this.initUniformLocation();
        }

        getWebglProgram(){
            return this.program;
        }

        initUniformLocation(){
            let gl = Demo.gl;
            if(this.shaderInfo){
                let uniforms = this.shaderInfo.uniform;
                for(let key in uniforms){
                    let loc = gl.getUniformLocation(this.program,key) as number;
                    uniforms[key] = loc;
                }
            }
        }

        use(){
            let gl = Demo.gl;
            gl.useProgram(this.program);
        }

        getUniformLocation(uniform:string){
            return this.shaderInfo.uniform[uniform];
        }

        setValueUniform3f(name:string,x:number,y:number,z:number){
            let gl = Demo.gl;
            let loc = this.getUniformLocation(name);
            gl.uniform3f(loc,x,y,z);
        }

    }

}