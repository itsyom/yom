/**
 * Created by ll on 2017/5/12.
 */

namespace HEY{

    function addLineNumbers( string:string ) {

        var lines = string.split( '\n' );

        for ( var i = 0; i < lines.length; i ++ ) {

            lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];

        }

        return lines.join( '\n' );

    }

    export function WGLShader(type:number,source:string){
        let gl:WebGLRenderingContext = Demo.gl;
        let shader = gl.createShader(type);


        gl.shaderSource( shader, source );
        gl.compileShader( shader );

        if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) === false ) {

            console.error( 'THREE.WebGLShader: Shader couldn\'t compile.' );

        }

        if ( gl.getShaderInfoLog( shader ) !== '' ) {

            console.warn( 'THREE.WebGLShader: gl.getShaderInfoLog()', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', gl.getShaderInfoLog( shader ), addLineNumbers( source ) );

        }

        return shader;
    }

}