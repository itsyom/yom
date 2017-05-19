/**
 * Created by ll on 2017/5/15.
 */

namespace HEY{

    export class AssimpJSONLoader{

        texturePath:string = null;

        constructor(){

        }

        load(url:string,onLoad:any,onError:any){

            this.texturePath = this.texturePath && ( typeof this.texturePath === "string" ) ? this.texturePath : this.extractUrlBase( url );

            let _this = this;
            FileLoader.load(url,function(data:any){

                let json = JSON.parse(data);
                let scene = null;
                scene = _this.parse(json);

                onLoad(scene);
            });


        }

        parse ( json:any ) {

            var meshes = this.parseList ( json.meshes, this.parseMesh );
            var materials = this.parseList ( json.materials, this.parseMaterial );
            return this.parseObject( json, json.rootnode, meshes, materials );

        }

        parseList ( json:any, handler:any ) {

            var meshes = new Array( json.length );
            for ( var i = 0; i < json.length; ++ i ) {

                meshes[ i ] = handler.call( this, json[ i ] );

            }
            return meshes;

        }

        parseMesh ( json:any ) {

            var geometry = new GeometryBuffer();

            var i, l, face;

            var indices = [];

            var vertices = json.vertices || [];
            var normals = json.normals || [];
            var uvs = json.texturecoords || [];
            var colors = json.colors || [];

            uvs = uvs[ 0 ] || []; // only support for a single set of uvs

            for ( i = 0, l = json.faces.length; i < l; i ++ ) {

                face = json.faces[ i ];
                indices.push( face[ 0 ], face[ 1 ], face[ 2 ] );

            }

            geometry.setIndex( indices );
            geometry.addAttribute( 'position', new VertexAttribute(new Float32Array(vertices),3) );

            if ( normals.length > 0 ) {

                geometry.addAttribute( 'normal', new VertexAttribute(new Float32Array(normals),3) );

            }

            if ( uvs.length > 0 ) {

                geometry.addAttribute( 'uv', new  VertexAttribute(new Float32Array(uvs),2)  );

            }

            if ( colors.length > 0 ) {

                geometry.addAttribute( 'color', new  VertexAttribute(new Float32Array(colors),3) );

            }


            return geometry;

        }

        parseMaterial(json:any){
            let mat = new ShaderMaterial(ShaderLib.v_phongAssimp,ShaderLib.f_phongAssimp,{

            });

            let prop:any, has_textures = [], init_props:any = {} ;

            let self = this;

            function toColor( value_arr:any ) {

                var col = new THREE.Color();
                col.setRGB( value_arr[ 0 ], value_arr[ 1 ], value_arr[ 2 ] );
                return col;

            }

            function defaultTexture() {

                var im = new Image();
                im.width = 1;
                im.height = 1;
                return new THREE.Texture( im );

            }

            for ( let i in json.properties ) {

                prop = json.properties[ i ];

                if ( prop.key === '$tex.file' ) {

                    // prop.semantic gives the type of the texture
                    // 1: diffuse
                    // 2: specular mao
                    // 5: height map (bumps)
                    // 6: normal map
                    // more values (i.e. emissive, environment) are known by assimp and may be relevant
                    if ( prop.semantic === 1 || prop.semantic === 5 || prop.semantic === 6 || prop.semantic === 2 ) {

                        ( function( semantic ) {

                            var loader = new TextureLoader(),
                                keyname:string;

                            if ( semantic === 1 ) {

                                keyname = 'map';

                            } else if ( semantic === 5 ) {

                                keyname = 'bumpMap';

                            } else if ( semantic === 6 ) {

                                keyname = 'normalMap';

                            } else if ( semantic === 2 ) {

                                keyname = 'specularMap';

                            }

                            has_textures.push( keyname );

                            var material_url =  self.texturePath + prop.value;
                            loader.load( material_url, function( tex:Texture ) {
                                if ( tex ) {

                                    // TODO: read texture settings from assimp.
                                    // Wrapping is the default, though.
                                    tex.wrapS = tex.wrapT = RepeatWrapping;

                                    any(mat)[ keyname ] = tex;

                                }

                            } );

                        } )( prop.semantic );

                    }

                } else if ( prop.key === '?mat.name' ) {

                    init_props.name = prop.value;

                } else if ( prop.key === '$clr.diffuse' ) {

                    init_props.color = toColor( prop.value );

                } else if ( prop.key === '$clr.specular' ) {

                    init_props.specular = toColor( prop.value );

                } else if ( prop.key === '$clr.emissive' ) {

                    init_props.emissive = toColor( prop.value );

                } else if ( prop.key === '$mat.shadingm' ) {

                    // aiShadingMode_Flat
                    if ( prop.value === 1 ) {

                        init_props.shading = THREE.FlatShading;

                    }

                } else if ( prop.key === '$mat.shininess' ) {

                    init_props.shininess = prop.value;

                }

            }

            // note: three.js does not like it when a texture is added after the geometry
            // has been rendered once, see http://stackoverflow.com/questions/16531759/.
            // for this reason we fill all slots upfront with default textures
            if ( has_textures.length ) {

                for ( let i = has_textures.length - 1; i >= 0; -- i ) {

                    init_props[ has_textures[ i ]] = defaultTexture();

                }

            }

            mat.setValues(init_props);
            return mat;

        }

        parseObject(json:any, node:any, meshes:any, materials:any ){
            let  obj = new Obj3D(),  idx;

            for (let  i = 0; node.meshes && i < node.meshes.length; ++ i ) {

                idx = node.meshes[ i ];
                obj.add( new Mesh(meshes[idx],materials[json.meshes[ idx ].materialindex] ));

            }

            for ( let i = 0; node.children && i < node.children.length; ++ i ) {

                obj.add( this.parseObject( json, node.children[ i ], meshes, materials ) );

            }

            return obj;
        }


        extractUrlBase ( url:string ) {

            // from three/src/loaders/Loader.js
            var parts = url.split( '/' );
            parts.pop();
            return ( parts.length < 1 ? '.' : parts.join( '/' ) ) + '/';

        }
    }

}