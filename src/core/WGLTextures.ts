/**
 * Created by ll on 2017/5/16.
 */

namespace HEY{

    let properties:{[key:string]:any} = null;

    let paramHeyToGL:any = null;


    function createTexture( type:any, target:any, count:number ) {
        let gl = GL.gl;
        var data = new Uint8Array( 4 ); // 4 is required to match default unpack alignment of 4.
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
            }

            let glFormat = paramHeyToGL(tex.format);
            let glType = paramHeyToGL(tex.type);

            gl.bindTexture(gl.TEXTURE_2D,properties.webglTexture);

            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

            gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, tex.flipY ); //flip y

            gl.texImage2D( gl.TEXTURE_2D, 0, glFormat, glFormat, glType, tex.image );

            gl.generateMipmap(gl.TEXTURE_2D);

            gl.bindTexture(gl.TEXTURE_2D,null);

            properties.version = tex.version;
        }

    }

}