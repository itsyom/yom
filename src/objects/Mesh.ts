/**
 * Created by ll on 2017/5/15.
 */

///<reference path = "./Obj3D.ts"/>

namespace HEY{


    export class Mesh extends Obj3D{

        geometry:GeometryBuffer = null;
        material:ShaderMaterial = null;



        constructor(geometry:GeometryBuffer,material:ShaderMaterial){
            super();
            this.geometry = geometry;
            this.material = material;
        }



    }

}