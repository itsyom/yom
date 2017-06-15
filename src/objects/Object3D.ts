/**
 * Created by ll on 2017/3/14.
 */

namespace HEY{

    import Quaternion = THREE.Quaternion;
    import Matrix4 = THREE.Matrix4;
    import Euler = THREE.Euler;
    import Vector3 = THREE.Vector3;
    export class Object3D {

        transform:Transform = new Transform();

        matrixWorld:Matrix4 = new Matrix4();

        children:Object3D[] = [];

        parent:Object3D = null;

        uuid:string = null;

        name:string = "";

        constructor(){
            this.uuid = _Math.generateUUID();
        }

        add(child:Object3D){
            if(child === this){
                console.log("can't add self as child");
                return;
            }
            let index = this.children.indexOf(child);
            if(index !== -1){
                console.log("child already exists");
                return;
            }
            this.children.push(child);
            child.parent = this;
        }

        remove(child:Object3D){
            let index = this.children.indexOf(child);
            if(index !== -1){
                this.children.splice(index,1);
            }
        }

        composeMatrix(){
            this.transform.updateMatrix();
            this.matrixWorld.copy(this.transform.matrix);
        }

        updateMatrixWorld(force = false){
            this.composeMatrix();

            if(this.parent !== null){
                this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrixWorld);
            }

            let children = this.children;
            for(let i = 0;i < children.length;i++){
                let child = children[i];
                if(child){
                    child.updateMatrixWorld();
                }
            }
        }


    }

}