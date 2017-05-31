/**
 * Created by hey on 2017/5/13.
 */

///<reference path="../textures/Texture.ts"/>

namespace HEY{

    let mat4array = new Float32Array( 16 );
    let mat3array = new Float32Array( 9 );


    let emptyTexutre = new Texture();

    export class WGLUniform{
        type:number = null;
        loc:WebGLUniformLocation = -1;

        id:string = null;
        constructor(id:string,loc:WebGLUniformLocation,type:number){
            this.id = id;
            this.loc = loc;
            this.type = type;
        }

        setValue(value:any,render:WebGL2Renderer){
            // if(!value) return;
            let gl = GL.gl;
            switch (this.type){
                case gl.FLOAT_VEC3:
                    if(value !== undefined){
                        gl.uniform3fv(this.loc,value);
                    }
                    break;
                case gl.SAMPLER_2D:
                    this.setValueT1(this.loc,value,render);
                    break;
                case gl.FLOAT_MAT4:
                    if(value !== undefined){
                        mat4array.set(value);
                        gl.uniformMatrix4fv(this.loc,false,mat4array);//elements
                    }
                    break;
                case gl.FLOAT_VEC3:
                    if(value !== undefined){
                        gl.uniform3fv(this.loc,value);
                    }
                    break;
                default:
                    console.error("HEY: unknown uniform type: ",this.type)

            }

        }

        setValueT1(loc:WebGLUniformLocation,tex:Texture,render:WebGL2Renderer){
            let unit = render.allocTextureUnit();
            GL.gl.uniform1i(loc,unit);
            render.setTexture2D(tex||emptyTexutre,unit);
        }
    }

    export class WGLUniforms{

        map:{[key:string]:WGLUniform} = {};

        render:WebGL2Renderer = null;

        constructor(program:WebGLProgram,render:WebGL2Renderer){
            this.render = render;
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

        load(values:any){
            for(let key in this.map){
                let value = values[key];
                let uniform = this.map[key];
                uniform.setValue(value,this.render);
            }

        }

        setValue(name:string,value:any){
            let uniform = this.map[name];
            if(uniform){
                uniform.setValue(value,this.render);
            }
        }


    }




}