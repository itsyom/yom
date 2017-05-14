/**
 * Created by hey on 2017/5/14.
 */

namespace HEY{

    export class RenderItem{


        geometry:GeometryBuffer = null;
        material:ShaderMaterial = null;
        constructor(geometry:GeometryBuffer,material:ShaderMaterial){
            this.geometry = geometry;
            this.material = material;
        }




    }

}