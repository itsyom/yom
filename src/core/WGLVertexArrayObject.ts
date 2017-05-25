/**
 * Created by ll on 2017/5/25.
 */
namespace HEY{

    export class WGLVertexArrayObject{

        _vao:number = -1;

        version:number = null;

        constructor(_vao:number){
            this._vao = _vao;
        }


        update(object:Mesh,properties:any,attributes:any){ //现在是假设  属性结构 不会发生变化
            let gl = GL.gl;

            let material = object.material;
            let geometry = object.geometry;


            let materialProperties = properties.get(material);
            let program = materialProperties.program;
            let programAttributes = program.getAttributes();

            any(gl).bindVertexArray(this._vao);

            for(let name in programAttributes){
                if(name == "index"){
                    continue;
                }
                let attributeLoc = programAttributes[name];
                if(attributeLoc >= 0){
                    let geometryAttribute = geometry.attributes[name];

                    if(geometryAttribute !== undefined){

                        let buffer = attributes.get(geometryAttribute);
                        gl.bindBuffer(gl.ARRAY_BUFFER,buffer.buffer);

                        let {size,type,normalized} = geometryAttribute;
                        //todo 暂时是 stride = 0, offset = 0
                        gl.vertexAttribPointer(attributeLoc,size,type,normalized,0,0);
                        gl.enableVertexAttribArray(attributeLoc);
                    }
                }
            }

            let geometryAttri = geometry.index;
            let buffer = attributes.get(geometryAttri).buffer;
            console.log("==========element buffer",buffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);

            any(gl).bindVertexArray(null);
            // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
            // gl.bindBuffer(gl.ARRAY_BUFFER,null);

        }








    }

}