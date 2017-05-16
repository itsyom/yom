/**
 * Created by hey on 2017/2/28.
 */

namespace HEY{



    let _usedTextureUnits:number = 0;


    function paramHeyToGL(p:number){
        let gl = GL.gl;

        if(p === RGBAFormat) return gl.RGBA;
        if(p === RGBFormat) return gl.RGB;
        if(p === UnsignedByteType) return gl.UNSIGNED_BYTE;



    }

    let properties:WGLProperties = null;

    let textures:WGLTextures = null;







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
            GL.gl = gl;

            properties = new WGLProperties();
            textures = new WGLTextures(properties,paramHeyToGL);
        }


        render(scene:Scene,camera:any){
            scene.updateMatrixWorld();

            camera.updateMatrixWorld();
            camera.updateProjectionMatrix();
            camera.matrixWorldInverse.getInverse(camera.matrixWorld);

            WGLRenderList.getInstance().clear();

            this.projectObject(scene);

            let renderList = this.getRenderList();
            this.renderRenderList(renderList,camera);
        }

        projectObject(obj:Obj3D){
            if(obj instanceof Mesh){
                WGLRenderList.getInstance().add(new RenderItem(obj.geometry,obj.material,obj));
            }

            for(let i = 0,l = obj.children.length;i < l;i++){
                this.projectObject(obj.children[i]);
            }
        }

        getRenderList(){
            return WGLRenderList.getInstance();
        }

        renderRenderList(renderList:WGLRenderList,camera:any){
            for(let i = 0;i < renderList.items.length;i++){
                let item = renderList.items[i];
                this.renderItem(item,camera);
            }
        }

        renderItem(item:RenderItem,camera:any){
            let geometry = item.geometry;
            let material = item.material;
            let obj:Obj3D = item.object;

            this.setProgram(material,camera,obj);

            this.setupVertexAttributes(geometry,material);

            this.renderGeometry(geometry);
        }

        getProgram(material:ShaderMaterial){
            let program = material.getProgram();
            if(program === null){
                let wProgram = new WGLProgram(material.vs,material.fs,this);
                material.program = wProgram; //todo 以后program 由 render来管理
            }
            return material.program.program;
        }

        setProgram(material:ShaderMaterial,camera:any,obj:Obj3D){
            _usedTextureUnits = 0;

            let gl = GL.gl;
            let program =  this.getProgram(material);

            gl.useProgram(program);

            let pUniforms = material.program.getUniforms();
            pUniforms.load(material);

            pUniforms.setValue("projection",camera.projectionMatrix.elements);
            pUniforms.setValue("view",camera.matrixWorldInverse.elements);
            pUniforms.setValue("model",obj.matrixWorld.elements);

        }

        setupVertexAttributes(geometry:GeometryBuffer,material:ShaderMaterial){
            let gl = GL.gl;
            if(geometry.vertexArrayBuffer === null){
                let vao = (gl as any).createVertexArray();
                any(gl).bindVertexArray(vao);

                let programAttributes = material.program.getAttributes();

                for(let name in programAttributes){
                    if(name == "index"){
                        continue;
                    }
                    let attributeLoc = programAttributes[name];
                    if(attributeLoc >= 0){
                        let geometryAttribute = geometry.attributes[name];
                        if(geometryAttribute !== undefined){
                            let {bufferData,size,type,normalized} = geometryAttribute;

                            let buffer = gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
                            gl.bufferData(gl.ARRAY_BUFFER,bufferData,gl.STATIC_DRAW);

                            //todo 暂时是 stride = 0, offset = 0
                            gl.vertexAttribPointer(attributeLoc,size,type,normalized,0,0);
                            gl.enableVertexAttribArray(attributeLoc);
                        }
                    }
                }

                let geometryAttri = geometry.index;
                let buffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,geometryAttri.bufferData,gl.STATIC_DRAW);

                any(gl).bindVertexArray(null);

                geometry.vertexArrayBuffer = vao;
            }
        }

        renderGeometry(geometry:GeometryBuffer){
            let gl:any = GL.gl;
            gl.bindVertexArray(geometry.vertexArrayBuffer);

            let index = geometry.index;
            gl.drawElements(gl.TRIANGLES,index.count,index.type,index.offset);
        }




        allocTextureUnit(){
            let textureUnit = _usedTextureUnits;
            _usedTextureUnits += 1;
            return textureUnit;
        }

        setTexture2D(tex:Texture,unit:number){
            textures.setTexture2D(tex,unit);
        }

    }

}