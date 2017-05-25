/**
 * Created by hey on 2017/2/28.
 */

namespace HEY{

    import Camera = THREE.Camera;

    function paramHeyToGL(p:number){
        let gl = GL.gl;

        if(p === RGBAFormat) return gl.RGBA;
        if(p === RGBFormat) return gl.RGB;
        if(p === UnsignedByteType) return gl.UNSIGNED_BYTE;
        if(p === LinearFilter) return gl.LINEAR;
        if(p === LinearMipMapLinearFilter) return gl.LINEAR_MIPMAP_LINEAR;
        if(p === RepeatWrapping) return gl.REPEAT;



    }
    //
    // let properties:WGLProperties = null;
    //
    // let textures:WGLTextures = null;
    //
    // let states:WGLState = null;





    export class WebGL2Renderer{

        gl:WebGLRenderingContext = null;

        domElement:HTMLCanvasElement = null;

        render:(scene:Scene,camera:Camera)=>void = null;

        setTexture2D:(texture:Texture,unit:number)=>void = null;

        allocTextureUnit:()=>number = null;

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

                var contextAttributes = {
                    alpha: _alpha,
                    depth: _depth,
                    stencil: _stencil,
                    antialias: _antialias,
                    premultipliedAlpha: _premultipliedAlpha,
                    preserveDrawingBuffer: _preserveDrawingBuffer
                };

                gl = _context || _canvas.getContext( 'webgl2', contextAttributes );

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
            GL.gl = gl;

            // -----------closure data area start
            let _this = this;
            let properties = new WGLProperties();
            let textures = new WGLTextures(properties,paramHeyToGL);
            let states = new WGLState();
            let attributes = new WGLAttributes();
            let geometries = new WGLGeometries(attributes);
            let objects:any = new WGLObjects(geometries);

            let vaos:any = new WGLVAOS(properties,attributes);

            let renderInfo = new RenderInfo();

            let _usedTextureUnits:number = 0;
            //------------end



            function render(scene:Scene,camera:any){

                renderInfo.frame++;

                scene.updateMatrixWorld();

                camera.updateMatrixWorld();
                camera.updateProjectionMatrix();
                camera.matrixWorldInverse.getInverse(camera.matrixWorld);

                WGLRenderList.getInstance().clear();

                projectObject(scene);

                let renderList = getRenderList();
                renderRenderList(renderList,camera,scene);
            }

            function projectObject(obj:Obj3D){

                if(obj instanceof Mesh){
                    objects.update(obj,renderInfo);

                    WGLRenderList.getInstance().add(new RenderItem(obj.geometry,obj.material,obj));
                }

                for(let i = 0,l = obj.children.length;i < l;i++){
                    projectObject(obj.children[i]);
                }
            }

            function getRenderList(){
                return WGLRenderList.getInstance();
            }

            function renderRenderList(renderList:WGLRenderList,camera:any,scene:Scene){
                for(let i = 0;i < renderList.items.length;i++){
                    let item = renderList.items[i];
                    renderItem(item,camera,scene);
                }
            }

            function renderItem(item:RenderItem,camera:any,scene:Scene){
                let geometry = item.geometry;
                let material = item.material;
                let obj:Mesh = item.object;


                states.setMaterial(material);

                setProgram(material,camera,obj,scene);

                setupVertexAttributes(obj);

                renderGeometry(geometry);
            }

            function getProgram(material:ShaderMaterial):WGLProgram{
                let materialProperties = properties.get(material);

                let program = materialProperties.program;
                if(program === undefined){
                    let wProgram = new WGLProgram(material.vs,material.fs,_this);
                    materialProperties.program = wProgram;
                }
                return materialProperties.program;
            }

            function setProgram(material:ShaderMaterial,camera:any,obj:Obj3D,scene:Scene){
                _usedTextureUnits = 0;

                let program = getProgram(material);

                gl.useProgram(program.program);

                let pUniforms = program.getUniforms();
                pUniforms.load(material);

                pUniforms.setValue("projection",camera.projectionMatrix.elements);
                pUniforms.setValue("view",camera.matrixWorldInverse.elements);
                pUniforms.setValue("model",obj.matrixWorld.elements);

                pUniforms.setValue("ambient",scene.ambient);
                pUniforms.setValue("lightPos",[camera.position.x,camera.position.y,camera.position.z]);

                return program;
            }

            function setupVertexAttributes(obj:Mesh){
                // if(geometry.vertexArrayBuffer === null){
                //     let vao = (gl as any).createVertexArray();
                //     any(gl).bindVertexArray(vao);
                //
                //     let materialProperties = properties.get(material);
                //     let programAttributes = materialProperties.program.getAttributes();
                //
                //     for(let name in programAttributes){
                //         if(name == "index"){
                //             continue;
                //         }
                //         let attributeLoc = programAttributes[name];
                //         if(attributeLoc >= 0){
                //             let geometryAttribute = geometry.attributes[name];
                //             if(geometryAttribute !== undefined){
                //                 let {array,size,type,normalized} = geometryAttribute;
                //
                //                 let buffer = gl.createBuffer();
                //                 gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
                //                 gl.bufferData(gl.ARRAY_BUFFER,array,gl.STATIC_DRAW);
                //
                //                 //todo 暂时是 stride = 0, offset = 0
                //                 gl.vertexAttribPointer(attributeLoc,size,type,normalized,0,0);
                //                 gl.enableVertexAttribArray(attributeLoc);
                //             }
                //         }
                //     }
                //
                //     let geometryAttri = geometry.index;
                //     let buffer = gl.createBuffer();
                //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
                //     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,geometryAttri.array,gl.STATIC_DRAW);
                //
                //     any(gl).bindVertexArray(null);
                //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
                //     gl.bindBuffer(gl.ARRAY_BUFFER,null);
                //
                //     geometry.vertexArrayBuffer = vao;
                // }

                vaos.update(obj);
            }

            function renderGeometry(geometry:GeometryBuffer){
                let vao = vaos.get(geometry)._vao;
                any(gl).bindVertexArray(vao);

                let index = geometry.index;
                gl.drawElements(gl.TRIANGLES,index.count,index.type,index.offset);//todo 目前只绘制三角形

                any(gl).bindVertexArray(null); //解绑，很重要
            }


            //-------------member area start
            this.allocTextureUnit = function (){
                let textureUnit = _usedTextureUnits;
                _usedTextureUnits += 1;
                return textureUnit;
            }

            this.setTexture2D = function (tex:Texture,unit:number){
                textures.setTexture2D(tex,unit);
            }


            this.gl = gl;
            this.domElement = _canvas;
            this.render = render;
            //----------------end


        }






    }

}