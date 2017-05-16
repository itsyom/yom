/**
 * Created by hey on 2017/5/14.
 */

namespace HEY{

    export class RenderItem{


        geometry:GeometryBuffer = null;
        material:ShaderMaterial = null;
        object:Obj3D = null;

        constructor(geometry:GeometryBuffer,material:ShaderMaterial,object:Obj3D){
            this.geometry = geometry;
            this.material = material;
            this.object = object;
        }




    }

}