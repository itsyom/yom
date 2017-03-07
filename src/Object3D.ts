/**
 * Created by ll on 2017/3/7.
 */
namespace HEY{
    import Matrix4 = THREE.Matrix4;
    export class Object3D{

        matrix_model:Matrix4 = new Matrix4();
        matrix_view:Matrix4 = new Matrix4();
        matrix_projection:Matrix4 = new Matrix4();

        matrix_translate:Matrix4 = new Matrix4();
        matrix_scale:Matrix4 = new Matrix4();
        matrix_rotation:Matrix4 = new Matrix4();

        constructor(){

        }

        getMatrixModel(){
            return this.matrix_translate.clone().multiply(this.matrix_rotation).multiply(this.matrix_scale).elements;
        }


    }

}