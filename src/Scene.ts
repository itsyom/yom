/**
 * Created by ll on 2017/3/14.
 */
namespace HEY{

    import Color = THREE.Color;
    export class Scene extends Obj3D{
        private static instance:Scene = null;

        children:any[] = [];
        private constructor(){
            super();
        }

        static getInstance(){
            if(Scene.instance === null){
                Scene.instance = new Scene();
            }
            return Scene.instance;
        }

        init(){


        }

        draw(){
            this.updateMatrixWorld();

            let children = this.children;
            for(let i = 0;i < children.length;i++){
                if(children[i]){
                    children[i].draw();
                }
            }
        }
    }

}