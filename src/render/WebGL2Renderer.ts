/**
 * Created by hey on 2017/2/28.
 */

namespace HEY{

    import Camera = THREE.Camera;
    import Vector4 = THREE.Vector4;

    class WGLVertexArrayObject{

        _vao:number = -1;

        version:number = null;

        constructor(_vao:number){
            this._vao = _vao;
        }


        update(object:Mesh,properties:any,attributes:any){ //现在是假设  属性结构 不会发生变化
            let gl = GL.gl;

            let material = object.material;
            let geometry = object.geometry;


            let materialProperties = properties.get(material);
            let program = materialProperties.program;
            let programAttributes = program.getAttributes();

            any(gl).bindVertexArray(this._vao);

            for(let name in programAttributes){
                if(name == "index"){
                    continue;
                }
                let attributeLoc = programAttributes[name];
                if(attributeLoc >= 0){
                    let geometryAttribute = geometry.attributes[name];

                    if(geometryAttribute !== undefined){

                        let buffer = attributes.get(geometryAttribute);
                        gl.bindBuffer(gl.ARRAY_BUFFER,buffer.buffer);

                        let {size,type,normalized} = geometryAttribute;
                        //todo 暂时是 stride = 0, offset = 0
                        gl.vertexAttribPointer(attributeLoc,size,paramHeyToGL(type),normalized,0,0);
                        gl.enableVertexAttribArray(attributeLoc);
                    }
                }
            }

            let geometryAttri = geometry.index;
            let buffer = attributes.get(geometryAttri).buffer;
            console.log("==========element buffer",buffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);

            any(gl).bindVertexArray(null);
            // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
            // gl.bindBuffer(gl.ARRAY_BUFFER,null);

        }

    }


    class WGLVAOS{

        constructor(properties:any,attributes:any){
            let vaos:WGLVertexArrayObject[] = [];

            function get(geometry:GeometryBuffer){
                return vaos[geometry.id];
            }

            function add(geometry:GeometryBuffer,vao:WGLVertexArrayObject){
                vaos[geometry.id] = vao;
            }

            function remove(geometry:GeometryBuffer){
                delete vaos[geometry.id];
            }


            function createVAO(object:Mesh){
                let gl = GL.gl;
                let _vao = any(gl).createVertexArray();
                let vao = new WGLVertexArrayObject(_vao);

                vao.update(object,properties,attributes);

                vao.version = object.geometry.version;

                return vao;

            }

            function update(object:Mesh){
                let geometry = object.geometry;
                let vao = get(geometry);
                if(vao === undefined){
                    vaos[geometry.id] = createVAO(object);
                    vao = vaos[geometry.id];
                }
                if(vao.version < geometry.version){
                    vao.update(object,properties,attributes);

                    vao.version = geometry.version;
                }
            }


            return {
                get:get,
                add:add,
                remove:remove,
                update:update
            }
        }

    }

    class WGLObjects{

        constructor(geometries:any){
            let updateList:any[] = [];

            function update(object:Mesh,renderInfo:RenderInfo){
                let geometry = object.geometry;

                if(updateList[geometry.id] != renderInfo.frame){
                    geometries.update(object);

                    updateList[geometry.id] = renderInfo.frame;
                }
            }

            return {
                update:update
            }
        }

    }

    class WGLGeometries{
        constructor(attributes:any){
            function updateAttributes(object:Mesh){

                let gl = GL.gl;
                let geometry = object.geometry;

                for(let name in geometry.attributes){
                    if(name == "index"){
                        continue;
                    }
                    let geometryAttribute = geometry.attributes[name];
                    if(geometryAttribute !== undefined){
                        attributes.update(geometryAttribute,gl.ARRAY_BUFFER);
                    }
                }

                let geometryAttri = geometry.index;
                attributes.update(geometryAttri,gl.ELEMENT_ARRAY_BUFFER);

            }

            function update(object:Mesh){
                updateAttributes(object);
            }

            return {
                update:update
            }
        }

    }

    class WGLAttributes{
        constructor(){

            let buffers:{[key:string]:any} = {};

            function createBuffer(attribute:VertexAttribute|IndexAttribute,type:any){

                let gl = GL.gl;
                let buffer = gl.createBuffer();
                gl.bindBuffer(type,buffer);
                let usage = attribute.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
                let array = attribute.array;

                gl.bufferData(type,array,usage);


                console.log("buffer created........");

                return {buffer:buffer,version:attribute.version};
            }

            function updateBuffer(buffer:any,attribute:VertexAttribute|IndexAttribute,type:any){
                let gl = GL.gl;
                let usage = attribute.dynamic?gl.DYNAMIC_DRAW:gl.STATIC_DRAW;

                gl.bindBuffer(type,buffer);
                gl.bufferData(type,attribute.array,usage);
            }

            function update(attribute:VertexAttribute|IndexAttribute,type:any){

                let buffer = buffers[attribute.uuid];

                if(buffer === undefined){
                    buffer = createBuffer(attribute,type);
                    buffers[attribute.uuid] = buffer;
                }

                if(buffer.version < attribute.version){
                    updateBuffer(buffer.buffer,attribute,type);
                    buffer.version = attribute.version;
                }
            }

            function get(attribure:VertexAttribute|IndexAttribute){
                return buffers[attribure.uuid];
            }

            return {
                get:get,
                update:update
            }
        }
    }

    function paramHeyToGL(p:number){
        let gl = GL.gl;

        if(p === RGBAFormat) return gl.RGBA;
        if(p === RGBFormat) return gl.RGB;
        if(p === UnsignedByteType) return gl.UNSIGNED_BYTE;
        if(p === LinearFilter) return gl.LINEAR;
        if(p === LinearMipMapLinearFilter) return gl.LINEAR_MIPMAP_LINEAR;
        if(p === RepeatWrapping) return gl.REPEAT;
        if(p === FLOAT) return gl.FLOAT;


    }

    export class WebGL2Renderer{

        gl:WebGLRenderingContext = null;

        domElement:HTMLCanvasElement = null;

        render:(scene:Scene,camera:Camera)=>void = null;

        setTexture2D:(texture:Texture,unit:number)=>void = null;

        allocTextureUnit:()=>number = null;

        constructor(parameters:any = null){
            parameters = parameters || {};

            let _canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' ),
                _context = parameters.context !== undefined ? parameters.context : null,

                _alpha = parameters.alpha !== undefined ? parameters.alpha : false,
                _depth = parameters.depth !== undefined ? parameters.depth : true,
                _stencil = parameters.stencil !== undefined ? parameters.stencil : true,
                _antialias = parameters.antialias !== undefined ? parameters.antialias : false,
                _premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
                _preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;


            let _width = _canvas.width;
            let _height = _canvas.height;

            let _viewport:Vector4 = new Vector4(0,0,_width,_height);




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



            function render(scene:Scene,camera:any,target:WGLRenderTarget = null){

                renderInfo.frame++;

                scene.updateMatrixWorld();

                camera.updateMatrixWorld();
                camera.updateProjectionMatrix();
                camera.matrixWorldInverse.getInverse(camera.matrixWorld);

                WGLRenderList.getInstance().clear();

                projectObject(scene);

                setRenderTarget(target);

                _this.clear();


                let renderList = getRenderList();
                renderRenderList(renderList,camera,scene);
            }


            function setRenderTarget(renderTarget:WGLRenderTarget){
                if(renderTarget && properties.get(renderTarget).webglFramebuffer === undefined){
                    textures.setupRenderTarget(renderTarget);
                }
                let gl = GL.gl;
                let framebuffer = null;
                if(renderTarget){
                    framebuffer = properties.get(renderTarget).webglFramebuffer;
                    let {x,y,z,w} = renderTarget.viewport;
                    gl.viewport(x,y,z,w);
                }else{
                    gl.viewport(0,0,_width,_height);
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
            }


            function projectObject(obj:Object3D){

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

            function setProgram(material:ShaderMaterial, camera:any, obj:Object3D, scene:Scene){
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


        clear(){
            let gl = GL.gl;
            gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        }



    }

}