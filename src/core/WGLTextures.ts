/**
 * Created by ll on 2017/5/16.
 */

namespace HEY{
    /**
     * 纹理默认是 1*1  黑色方块
     * @param type
     * @param target  2d  or cubemap
     * @param count
     * @returns {any}
     */
    function createDefaultTexture(type:any, target:any, count:number ) {
        let gl = GL.gl;
        var data = new Uint8Array( [255,0,0,255] ); // 4 is required to match default unpack alignment of 4.
        var texture = gl.createTexture();

        gl.bindTexture( type, texture );
        gl.texParameteri( type, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        gl.texParameteri( type, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

        //target 为 cubemap时有用
        for ( var i = 0; i < count; i ++ ) {

            gl.texImage2D( target + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data );

        }

        return texture;

    }

    import RenderTarget = THREE.RenderTarget;
    var emptyTextures:{[key:number]:any} = {};

    export class WGLTextures{

        setTexture2D:any = null;

        setupRenderTarget:any = null;

        constructor(properties:{[key:string]:any},paramHeyToGL:any){

            emptyTextures[ GL.gl.TEXTURE_2D ] = createDefaultTexture( GL.gl.TEXTURE_2D, GL.gl.TEXTURE_2D, 1 );


            function setTexture2D(tex:Texture,unit:number){

                let textureProperties = properties.get(tex);

                if(tex.version > 0 && textureProperties.version !== tex.version){
                    uploadTexture(textureProperties,tex);
                }

                GL.gl.activeTexture(GL.gl.TEXTURE0+unit);
                GL.gl.bindTexture(GL.gl.TEXTURE_2D,textureProperties.webglTexture||emptyTextures[GL.gl.TEXTURE_2D]);
            }

            function uploadTexture(textureProperties:any,texture:Texture){
                let gl = GL.gl;

                if(textureProperties.webglInit === undefined){
                    textureProperties.webglInit = true;
                    textureProperties.webglTexture = GL.gl.createTexture();

                    texture.addEventListener("dispose",onTextureDispose);
                }

                let glFormat = paramHeyToGL(texture.format);
                let glType = paramHeyToGL(texture.type);

                gl.bindTexture(gl.TEXTURE_2D,textureProperties.webglTexture);

                gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );
                gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha );
                gl.pixelStorei( gl.UNPACK_ALIGNMENT, texture.unpackAlignment );

                setTextureParameters(gl.TEXTURE_2D,texture);

                if(texture instanceof DepthTexture){
                    gl.texImage2D(gl.TEXTURE_2D,0,glFormat,texture.image.width,texture.image.height,0,glFormat,glType,null);
                }else{
                    gl.texImage2D( gl.TEXTURE_2D, 0, glFormat, glFormat, glType, texture.image as HTMLImageElement );
                }

                if(texture.generateMipmaps){
                    gl.generateMipmap(gl.TEXTURE_2D);
                }

                gl.bindTexture(gl.TEXTURE_2D,null);

                textureProperties.version = texture.version;
            }

            /**
             * 释放 纹理对象
             * @param texture
             */
            function deallocateTexture( texture:Texture ) {

                var textureProperties = properties.get( texture );

                if ( texture.image && textureProperties.__image__webglTextureCube ) {

                    // cube texture

                    GL.gl.deleteTexture( textureProperties.__image__webglTextureCube );

                } else {

                    // 2D texture

                    if ( textureProperties.__webglInit === undefined ) return;

                    GL.gl.deleteTexture( textureProperties.__webglTexture );

                }

                // remove all webgl properties
                properties.remove( texture );

            }

            function onTextureDispose( event:any ) {

                var texture = event.target;

                texture.removeEventListener( 'dispose', onTextureDispose );

                deallocateTexture( texture );

            }

            function onRenderTargetDispose(event:any){
                let renderTarget = event.target;
                renderTarget.removeEventListener("dispose",onRenderTargetDispose);

                deallocateRenderTarget(renderTarget);
            }

            function deallocateRenderTarget(renderTarget:WGLRenderTarget){
                let renderTargetProperties = properties.get(renderTarget);
                let textureProperties = properties.get(renderTarget.texture);

                let gl = GL.gl;
                gl.deleteTexture(textureProperties.webglTexture);
                gl.deleteFramebuffer(renderTargetProperties.webglFramebuffer);

                if(renderTarget.depthTexture){
                    renderTarget.depthTexture.dispose();
                }

                if(renderTargetProperties.webglDepthbuffer){
                    gl.deleteRenderbuffer(renderTargetProperties.webglDepthbuffer);
                }

                properties.remove( renderTarget.texture );
                properties.remove( renderTarget );

            }

            function setupRenderTarget(renderTarget:WGLRenderTarget){
                let gl = GL.gl;
                let renderTargetProperties = properties.get(renderTarget);
                let textureProperties = properties.get(renderTarget.texture);

                renderTarget.addEventListener("dispose",onRenderTargetDispose);

                textureProperties.webglTexture = gl.createTexture();
                renderTargetProperties.webglFramebuffer = gl.createFramebuffer();

                gl.bindTexture(gl.TEXTURE_2D,textureProperties.webglTexture);
                setTextureParameters(gl.TEXTURE_2D,renderTarget.texture);

                setupFrameBufferTexture(renderTargetProperties.webglFramebuffer,renderTarget);
                gl.bindTexture(gl.TEXTURE_2D,null);

                if(renderTarget.depthBuffer){
                    setupDepthRenderbuffer(renderTarget);
                }
            }

            function setupFrameBufferTexture(framebuffer:any,renderTarget:WGLRenderTarget){
                let gl = GL.gl;
                let texture = renderTarget.texture;
                let format = paramHeyToGL(texture.format);
                let type = paramHeyToGL(texture.type);

                gl.texImage2D(gl.TEXTURE_2D,0,format,renderTarget.width,renderTarget.height,0,format,type,null);

                gl.generateMipmap(gl.TEXTURE_2D);//有可能作为纹理使用，则可以产生mipmap

                gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
                gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,properties.get(renderTarget.texture).webglTexture,0);
                gl.bindFramebuffer(gl.FRAMEBUFFER,null);
            }

            function setupDepthRenderbuffer(renderTarget:WGLRenderTarget){
                let gl = GL.gl;
                let renderTargetProperties = properties.get(renderTarget);
                if(renderTarget.depthTexture){
                    setupDepthTexture(renderTargetProperties.webglFramebuffer,renderTarget);//没有设置  stencil buffer
                }else{
                    gl.bindFramebuffer(gl.FRAMEBUFFER,renderTargetProperties.webglFramebuffer);

                    renderTargetProperties.webglDepthbuffer = gl.createRenderbuffer();

                    setupRenderBufferStorage(renderTargetProperties.webglDepthbuffer,renderTarget);
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER,null);
            }

            function setupDepthTexture(framebuffer:any,renderTarget:WGLRenderTarget){
                let textureProperties = properties.get(renderTarget.depthTexture);
                uploadTexture(textureProperties,renderTarget.depthTexture);
                let gl = GL.gl;

                gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
                gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,textureProperties.webglTexture,0);
            }

            // Setup storage for internal depth/stencil buffers and bind to correct framebuffer
            function setupRenderBufferStorage( renderbuffer:any, renderTarget:WGLRenderTarget ) {
                let _gl = GL.gl;
                _gl.bindRenderbuffer( _gl.RENDERBUFFER, renderbuffer );

                if ( renderTarget.depthBuffer && ! renderTarget.stencilBuffer ) {

                    _gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height );
                    _gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

                } else if ( renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

                    _gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height );
                    _gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

                } else {

                    // FIXME: We don't support !depth !stencil
                    _gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height );

                }

                _gl.bindRenderbuffer( _gl.RENDERBUFFER, null );

            }

            function setTextureParameters(textureType:any,texture:Texture){
                let gl = GL.gl;

                gl.texParameteri(textureType,gl.TEXTURE_WRAP_S,paramHeyToGL(texture.wrapS));
                gl.texParameteri(textureType,gl.TEXTURE_WRAP_T,paramHeyToGL(texture.wrapT));

                gl.texParameteri(textureType,gl.TEXTURE_MAG_FILTER,paramHeyToGL(texture.magFilter));
                gl.texParameteri(textureType,gl.TEXTURE_MIN_FILTER,paramHeyToGL(texture.minFilter));
            }


            this.setTexture2D = setTexture2D;

            this.setupRenderTarget = setupRenderTarget;

        }



    }

}