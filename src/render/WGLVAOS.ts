/**
 * Created by ll on 2017/5/25.
 */

namespace HEY{

    export class WGLVAOS{

        constructor(properties:any,attributes:any){
            let vaos:WGLVertexArrayObject[] = [];

            function get(geometry:GeometryBuffer){
                return vaos[geometry.id];
            }

            function add(geometry:GeometryBuffer,vao:WGLVertexArrayObject){
                vaos[geometry.id] = vao;
            }

            function remove(geometry:GeometryBuffer){
                delete vaos[geometry.id];
            }


            function createVAO(object:Mesh){
                let gl = GL.gl;
                let _vao = any(gl).createVertexArray();
                let vao = new WGLVertexArrayObject(_vao);

                vao.update(object,properties,attributes);

                vao.version = object.geometry.version;

                return vao;

            }

            function update(object:Mesh){
                let geometry = object.geometry;
                let vao = get(geometry);
                if(vao === undefined){
                    vaos[geometry.id] = createVAO(object);
                    vao = vaos[geometry.id];
                }
                if(vao.version < geometry.version){
                    vao.update(object,properties,attributes);

                    vao.version = geometry.version;
                }
            }


            return {
                get:get,
                add:add,
                remove:remove,
                update:update
            }
        }



    }

}