/**
 * Created by ll on 2017/3/14.
 */

namespace HEY{

    import Quaternion = THREE.Quaternion;
    import Matrix4 = THREE.Matrix4;
    import Euler = THREE.Euler;
    import Vector3 = THREE.Vector3;
    export class Obj3D {

        position:Vector3 = new Vector3();
        quaternion:Quaternion = new Quaternion();
        scale:Vector3 = new Vector3(1,1,1);

        rotation:Euler = new Euler();

        matrixWorld:Matrix4 = new Matrix4();


        vbo:WebGLBuffer = -1;
        shader:Shader = null;

        children:Obj3D[] = [];

        parent:Obj3D = null;

        constructor(){
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
            let matrix = new Matrix4();
            matrix.compose(this.position,this.quaternion,this.scale);
            this.matrixWorld.copy(matrix);
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

        draw(){
            this.render();

            let children = this.children;
            for(let i = 0;i < children.length;i++){
                if(children[i]){
                    children[i].draw();
                }
            }
        }

        render(){

        }


    }

}