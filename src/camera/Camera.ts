/**
 * Created by hey on 2017/3/25.
 */

namespace HEY{

    import Matrix4 = THREE.Matrix4;
    import Vector3 = THREE.Vector3;
    export class Camera{

        matrixWorldInverse = new Matrix4();
        projectionMatrix = new Matrix4();
        constructor(){


        }

        lookAt(eye:Vector3,target:Vector3,up:Vector3){
            let z = eye.sub(target).normalize();
            up = up.normalize();
            let x = new Vector3().crossVectors(up,z);
            let y = new Vector3().crossVectors(z,x);
            let eyeMatrix = new Matrix4().makeBasis(x,y,z);
            eyeMatrix.elements[12] = eye.x;
            eyeMatrix.elements[13] = eye.y;
            eyeMatrix.elements[14] = eye.z;

            this.matrixWorldInverse = eyeMatrix.getInverse(eyeMatrix);

            return eyeMatrix;
        }
    }

}