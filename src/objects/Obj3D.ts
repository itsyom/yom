/**
 * Created by ll on 2017/3/14.
 */

namespace HEY{

    import Quaternion = THREE.Quaternion;
    import Matrix4 = THREE.Matrix4;
    import Euler = THREE.Euler;
    import Vector3 = THREE.Vector3;
    export class Obj3D {

        transform:Transform = new Transform();

        matrixWorld:Matrix4 = new Matrix4();

        children:Obj3D[] = [];

        parent:Obj3D = null;

        uuid:string = null;

        constructor(){
            this.uuid = _Math.generateUUID();


        }

        add(child:Obj3D){
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

        remove(child:Obj3D){
            let index = this.children.indexOf(child);
            if(index !== -1){
                this.children.splice(index,1);
            }
        }


        composeMatrixWorld(){
            this.transform.updateMatrix();
            this.matrixWorld.copy(this.transform.matrix);
        }

        updateMatrixWorld(force = false){
            this.composeMatrixWorld();

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