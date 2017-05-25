/**
 * Created by ll on 2017/5/25.
 */

namespace HEY{

    export class WGLObjects{

        constructor(geometries:any){
            let updateList:any[] = [];

            function update(object:Mesh,renderInfo:RenderInfo){
                let geometry = object.geometry;

                if(updateList[geometry.id] != renderInfo.frame){
                    geometries.update(object);

                    updateList[geometry.id] = renderInfo.frame;
                }
            }



            return {
                update:update
            }

        }





    }

}