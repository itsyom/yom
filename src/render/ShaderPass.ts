/**
 * Created by ll on 2017/5/31.
 */

namespace HEY{

    import OrthographicCamera = THREE.OrthographicCamera;
    export class ShaderPass extends Pass{

        renderToScreen:boolean = false;

        scene:Scene = null;

        mesh:Mesh = null;
        material:ShaderMaterial = null;

        camera:OrthographicCamera = new OrthographicCamera(-1,1,1,-1);

        textureId:string = null;

        clear:boolean = false;

        constructor(material:ShaderMaterial,textureId:string = "diffuse"){
            super();
            this.needsSwap = true;

            let geometry = new GeometryBuffer();
            geometry.addAttribute("position",new VertexAttribute([-1,1,-1,-1,1,1,1,-1],2));
            geometry.addAttribute("uv",new VertexAttribute([0,1,0,0,1,1,1,0],2));
            geometry.setIndex([0,1,2,2,1,3]);
            this.mesh = new Mesh(geometry,material);

            this.scene = new Scene();
            this.scene.add(this.mesh);

            this.material = material;
            this.textureId = textureId;
        }

        render(renderer:WebGL2Renderer,writeBuffer:WGLRenderTarget,readBuffer:WGLRenderTarget){
            this.material.setAttribute(this.textureId,readBuffer.texture);
            if(this.renderToScreen){
                renderer.render(this.scene,this.camera,null,this.clear);
            }else{
                renderer.render(this.scene,this.camera,writeBuffer);
            }
        }

    }


}