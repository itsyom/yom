/**
 * Created by ll on 2017/5/25.
 */
namespace HEY{

    export class WGLGeometries{

        constructor(attributes:any){
            function updateAttributes(object:Mesh){

                let gl = GL.gl;
                let geometry = object.geometry;

                for(let name in geometry.attributes){
                    if(name == "index"){
                        continue;
                    }
                    let geometryAttribute = geometry.attributes[name];
                    if(geometryAttribute !== undefined){
                        attributes.update(geometryAttribute,gl.ARRAY_BUFFER);
                    }
                }

                let geometryAttri = geometry.index;
                attributes.update(geometryAttri,gl.ELEMENT_ARRAY_BUFFER);

            }


            function update(object:Mesh){
                updateAttributes(object);
            }

            return {
                update:update
            }
        }



    }

}