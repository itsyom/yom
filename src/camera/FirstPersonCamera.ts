/**
 * Created by ll on 2017/3/3.
 */
///<reference path="./Camera.ts" />
namespace HEY{

    import Matrix4 = THREE.Matrix4;
    import Vector3 = THREE.Vector3;
    export class PerspectiveCamera extends Camera{

        camera:THREE.Camera = null;

        keys:boolean[] = [];

        direction:Vector3 = new Vector3(0,0,-1);

        position:Vector3 = new Vector3();
        target:Vector3 = new Vector3();
        up:Vector3 = new Vector3();

        pitch:number = 0;
        yaw:number = 0;

        matrixWorld = new Matrix4();

        constructor(fov:number,aspect:number,near:number,far:number){
            super();
            this.camera = new THREE.PerspectiveCamera(fov,aspect,near,far);

            this.projectionMatrix = this.camera.projectionMatrix;

            this.setupListeners();
        }

        setupListeners(){

            let isDragging = false;
            let lastX:number = null,lastY:number = null;

            document.addEventListener("keydown",(event:KeyboardEvent)=>{
                // console.log(event.keyCode);
                this.keys[event.keyCode] = true;
            });

            document.addEventListener("keyup",(event:KeyboardEvent)=>{
                this.keys[event.keyCode] = false;
            });

            let canvas = Demo.renderer.domElement;
            canvas.addEventListener("mousedown",(e:MouseEvent)=>{
                isDragging = true;
            })


            canvas.addEventListener("mousemove",(()=>{

                return (e:MouseEvent)=>{
                    if(!isDragging) return;
                    if(lastX === null){
                        lastX = e.clientX;
                        lastY = e.clientY;
                    }else{
                        let sensitivity = 0.001;
                        let deltaX = e.clientX-lastX;
                        let deltaY = e.clientY-lastY;

                        this.yaw += deltaX*sensitivity;
                        // this.pitch += deltaY*sensitivity;

                        lastX = e.clientX;
                        lastY = e.clientY;
                    }
                }
            })( ))

            canvas.addEventListener("mouseup",()=>{
                isDragging = false;
                lastX = null;
                lastY = null;
            })

        }

        getViewMatrix(){
            return this.matrixWorldInverse;
        }

        moveAlongXAxis(delta:number){
            let y = new Vector3(0,1,0);
            let x = new Vector3().crossVectors(y,this.direction);
            this.position.add(x.multiplyScalar(delta));
        }

        moveAlongZAxis(delta:number){
            let z = this.direction;
            this.position.add(z.multiplyScalar(delta));
        }

        updateViewMatrix(){
            let direction = new Vector3();
            let cos = Math.cos,sin = Math.sin;
            direction.x = cos(this.pitch)*cos(this.yaw);
            direction.y = sin(this.pitch);
            direction.z = cos(this.pitch)*sin(this.yaw);
            this.direction = direction;

            let up = new Vector3(0,1,0);
            let x = new Vector3().crossVectors(up,direction);
            let matrix = new Matrix4().makeBasis(x,up,direction);
            matrix.elements[12] = this.position.x;
            matrix.elements[13] = this.position.y;
            matrix.elements[14] = this.position.z;
            this.matrixWorldInverse = matrix; //暂时matrixWorldInverse是matrixworld
        }

        update(){
            let speed:number = 0.2*2;
            let yawSensitivity = .005;
            this.updateViewMatrix();
            if(this.keys[87]){//w
                this.moveAlongZAxis(-speed);
            }
            if(this.keys[65]){//a
                this.moveAlongXAxis(-speed);
            }
            if(this.keys[83]){//s
                this.moveAlongZAxis(speed);
            }
            if(this.keys[68]){//d
                this.moveAlongXAxis(speed);
            }

        }


    }

}