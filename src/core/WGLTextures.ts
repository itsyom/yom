/**
 * Created by ll on 2017/5/16.
 */

namespace HEY{

    let properties:{[key:string]:any} = null;

    let paramHeyToGL:any = null;

    function createTexture( type:any, target:any, count:number ) {
        let gl = GL.gl;
        var data = new Uint8Array( [0,0,0,255] ); // 4 is required to match default unpack alignment of 4.
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

    function onTextureDispose( event:any ) {

        var texture = event.target;

        texture.removeEventListener( 'dispose', onTextureDispose );

        deallocateTexture( texture );

    }

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

    var emptyTextures:{[key:number]:any} = {};



    export class WGLTextures{

        constructor(proper:{[key:string]:any},map:any){
            properties = proper;
            paramHeyToGL = map;

            emptyTextures[ GL.gl.TEXTURE_2D ] = createTexture( GL.gl.TEXTURE_2D, GL.gl.TEXTURE_2D, 1 );
        }

        setTexture2D(tex:Texture,unit:number){

            let textureProperties = properties.get(tex);

            if(tex.version > 0 && textureProperties.version !== tex.version){
                this.uploadTexture(textureProperties,tex,unit);
            }

            GL.gl.activeTexture(GL.gl.TEXTURE0+unit);
            GL.gl.bindTexture(GL.gl.TEXTURE_2D,textureProperties.webglTexture||emptyTextures[GL.gl.TEXTURE_2D]);
        }

        uploadTexture(properties:any,tex:Texture,unit:number){
            let gl = GL.gl;

            if(properties.webglInit === undefined){
                properties.webglInit = true;
                properties.webglTexture = GL.gl.createTexture();

                tex.addEventListener("dispose",onTextureDispose);
            }

            let glFormat = paramHeyToGL(tex.format);
            let glType = paramHeyToGL(tex.type);

            gl.bindTexture(gl.TEXTURE_2D,properties.webglTexture);

            gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, tex.flipY );
            gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, tex.premultiplyAlpha );
            gl.pixelStorei( gl.UNPACK_ALIGNMENT, tex.unpackAlignment );


            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, paramHeyToGL(tex.wrapS));
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, paramHeyToGL(tex.wrapT) );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, paramHeyToGL(tex.magFilter) );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, paramHeyToGL(tex.minFilter) );


            gl.texImage2D( gl.TEXTURE_2D, 0, glFormat, glFormat, glType, tex.image );

            gl.generateMipmap(gl.TEXTURE_2D);

            gl.bindTexture(gl.TEXTURE_2D,null);

            properties.version = tex.version;
        }

    }

}