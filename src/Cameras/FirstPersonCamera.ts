/**
 * Created by ll on 2017/3/3.
 */

namespace HEY{

    import Matrix4 = THREE.Matrix4;
    import Camera = THREE.Camera;
    import Vector3 = THREE.Vector3;
    export class PerspectiveCamera{

        matrix_view:Matrix4 = new Matrix4();
        matrix_projection:Matrix4 = new Matrix4();

        camera:Camera = null;

        keys:boolean[] = [];

        camera_pos:Vector3 = new Vector3();
        camera_front:Vector3 = new Vector3(); //相机指向目标的方向
        camera_up:Vector3 = new Vector3();

        constructor(fov:number,aspect:number,near:number,far:number){
            this.camera = new THREE.PerspectiveCamera(fov,aspect,near,far);

            this.matrix_projection = this.camera.projectionMatrix;

            this.setupListeners();
        }

        setupListeners(){
            document.addEventListener("keydown",(event:KeyboardEvent)=>{
                // console.log(event.keyCode);
                this.keys[event.keyCode] = true;
            });

            document.addEventListener("keyup",(event:KeyboardEvent)=>{
                this.keys[event.keyCode] = false;
            });
        }

        lookAt(cameraPos:Vector3,target:Vector3,up:Vector3){
            this.camera_pos = cameraPos;
            this.camera_front = target.sub(cameraPos).normalize();
            this.camera_up = up.normalize();
            this.matrix_view.lookAt(this.camera_pos,target,up);
        }

        updateViewMatrix(){
            this.matrix_view.lookAt(this.camera_pos,new Vector3().addVectors(this.camera_pos,this.camera_front),this.camera_up);
        }

        update(){
            let speed:number = 0.2;

            if(this.keys[87]){//w
                this.camera_pos.addScaledVector(this.camera_front,speed);
                this.updateViewMatrix();
                let {x,y,z} = this.camera_pos;
                this.matrix_view.makeTranslation(x,y,z);
            }
            if(this.keys[65]){//a
                this.camera_pos.sub(new Vector3().crossVectors(this.camera_up,this.camera_front).multiplyScalar(speed));
                this.updateViewMatrix();
                let {x,y,z} = this.camera_pos;
                this.matrix_view.makeTranslation(x,y,z);
            }
            if(this.keys[83]){//s
                this.camera_pos.addScaledVector(this.camera_front,-speed);
                this.updateViewMatrix();
                let {x,y,z} = this.camera_pos;
                this.matrix_view.makeTranslation(x,y,z);
            }
            if(this.keys[68]){//d
                this.camera_pos.add(new Vector3().crossVectors(this.camera_up,this.camera_front).multiplyScalar(speed));
                this.updateViewMatrix();
                let {x,y,z} = this.camera_pos;
                this.matrix_view.makeTranslation(x,y,z);
            }

        }


    }

}