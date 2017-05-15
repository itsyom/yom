/**
 * Created by ll on 2017/5/15.
 */

namespace HEY{

    import Vector3 = THREE.Vector3;
    import Quaternion = THREE.Quaternion;
    import Matrix4 = THREE.Matrix4;
    export class Transform{

        postition:Vector3 = new Vector3();
        rotation:Quaternion = new Quaternion();
        scale:Vector3 = new Vector3(1,1,1);


        matrix:Matrix4 = new Matrix4();

        constructor(){

        }

        updateMatrix(){
            this.matrix.compose(this.postition,this.rotation,this.scale);
        }



    }

}