/**
 * Created by hey on 2017/2/28.
 */

namespace HEY{

    import getKeyFrameOrder = THREE.AnimationUtils.getKeyFrameOrder;
    export class WebGL2Renderer{

        gl:WebGLRenderingContext = null;

        domElement:HTMLCanvasElement = null;
        constructor(parameters:any = null){
            parameters = parameters || {};

            var _canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' ),
                _context = parameters.context !== undefined ? parameters.context : null,

                _alpha = parameters.alpha !== undefined ? parameters.alpha : false,
                _depth = parameters.depth !== undefined ? parameters.depth : true,
                _stencil = parameters.stencil !== undefined ? parameters.stencil : true,
                _antialias = parameters.antialias !== undefined ? parameters.antialias : false,
                _premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
                _preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;

            // initialize

            let  gl:WebGLRenderingContext;

            try {

                var attributes = {
                    alpha: _alpha,
                    depth: _depth,
                    stencil: _stencil,
                    antialias: _antialias,
                    premultipliedAlpha: _premultipliedAlpha,
                    preserveDrawingBuffer: _preserveDrawingBuffer
                };

                gl = _context || _canvas.getContext( 'webgl2', attributes );

                if ( gl === null ) {

                    if ( _canvas.getContext( 'webgl2' ) !== null ) {

                        throw 'Error creating WebGL2 context with your selected attributes.';

                    } else {

                        throw 'Error creating WebGL2 context.';

                    }

                }

                _canvas.addEventListener( 'webglcontextlost', (event:any)=>{
                    event.preventDefault();
                }, false );

            } catch ( error ) {

                console.error( 'THREE.WebGL2Renderer: ' + error );

            }

            this.gl = gl;
            this.domElement = _canvas;
        }


        render(){

            let renderList = this.getRenderList();
            this.renderRenderList(renderList);

        }

        getRenderList(){
            return WGLRenderList.getInstance();
        }

        renderRenderList(renderList:WGLRenderList){
            for(let i = 0;i < renderList.items.length;i++){
                let item = renderList.items[i];
                this.renderItem(item);
            }
        }

        renderItem(item:RenderItem){
            let geometry = item.geometry;
            let material = item.material;

            this.setProgram(material);

            this.setupVertexAttributes(geometry);

            this.renderGeometry(geometry);
        }

        getProgram(material:ShaderMaterial){
            let program = material.getProgram();
            if(program === null){
                let wProgram = new WGLProgram(material.vs,material.fs);
                material.program = wProgram;
            }
            return material.program.program;
        }

        setProgram(material:ShaderMaterial){
            let gl = GL.gl;
            let program =  this.getProgram(material);

            gl.useProgram(program);

            material.program.getUniforms().load(material);

        }

        setupVertexAttributes(geometry:GeometryBuffer){
            let gl = GL.gl;
            if(geometry.vertexArrayBuffer === null){
                let vao = gl.createBuffer(GL.VERTEX_ARRAY_BUFFER);

            }

            return geometry.vertexArrayBuffer;
        }

        renderGeometry(geometry:GeometryBuffer){
            let gl:any = GL.gl;
            gl.bindVertexArray(geometry.vertexArrayBuffer);

            let index = geometry.get("index");
            gl.drawElements(gl.TRIANGLES,index.count,gl.UNSIGNED_SHORT,index.offset);
        }

    }

}