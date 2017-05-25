/**
 * Created by ll on 2017/5/25.
 */

namespace HEY{

    export class WGLAttributes{

        constructor(){

            let buffers:{[key:string]:any} = {};


            function createBuffer(attribute:VertexAttribute|IndexAttribute,type:any){

                let gl = GL.gl;
                let buffer = gl.createBuffer();
                gl.bindBuffer(type,buffer);
                let usage = attribute.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
                let array = attribute.array;

                gl.bufferData(type,array,usage);


                console.log("buffer created........");

                return {buffer:buffer,version:attribute.version};
            }

            function updateBuffer(buffer:any,attribute:VertexAttribute|IndexAttribute,type:any){
                let gl = GL.gl;
                let usage = attribute.dynamic?gl.DYNAMIC_DRAW:gl.STATIC_DRAW;

                gl.bindBuffer(type,buffer);
                gl.bufferData(type,attribute.array,usage);
            }

            function update(attribute:VertexAttribute|IndexAttribute,type:any){

                let buffer = buffers[attribute.uuid];

                if(buffer === undefined){
                    buffer = createBuffer(attribute,type);
                    buffers[attribute.uuid] = buffer;
                }

                if(buffer.version < attribute.version){
                    updateBuffer(buffer.buffer,attribute,type);
                    buffer.version = attribute.version;
                }
            }

            function get(attribure:VertexAttribute|IndexAttribute){
                return buffers[attribure.uuid];
            }


            return {
                get:get,
                update:update
            }

        }



    }

}