/**
 * Created by hey on 2017/5/14.
 */


namespace HEY{

    export function any(tar:any){
        return (tar as any);
    }


    export function arrayMax( array:number[] ) {

        if ( array.length === 0 ) return - Infinity;

        var max = array[ 0 ];

        for ( var i = 1, l = array.length; i < l; ++ i ) {

            if ( array[ i ] > max ) max = array[ i ];

        }

        return max;

    }
}