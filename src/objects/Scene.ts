/**
 * Created by ll on 2017/3/14.
 */
namespace HEY{

    import Color = THREE.Color;
    export class Scene extends Obj3D{
        private static instance:Scene = null;

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


    }

}