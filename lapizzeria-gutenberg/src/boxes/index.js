import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

import { RichText, InspectorControls, ColorPalette, BlockControls, AlignmentToolbar } from "@wordpress/block-editor";
import { PanelBody } from '@wordpress/components';


import { ReactComponent as Logo } from '../pizzeria-icon.svg';


/** 7 pasos para crear un Bloque en Gutenberg
 *  
 * 1- Importar componente(s) que utilizaras
 * 2- Coloca el componente donde deseas Utilizarlo
 * 3- Crea una funcion que lea los Contenidos
 * 4- Registra un atributo
 * 5- Extraer el Contenido desde PROPS
 * 6- Guarda el contenido con setAttributes
 * 7- lee el contenido Guardado desde SAVE()
 */

registerBlockType( 'lapizzeria/boxes', {
    apiVersion: 2,
    title: 'Pizzeria Cajas',
    icon: { src: Logo },
    category: 'lapizzeria',
    attributes: {
        headingBox:{
            type:       'String',
            source:     'html',
            selector:   '.box h2'
        },
        textoBox:{
            type:       'String',
            source:     'html',
            selector:   '.box p'
        },
        colorFondo: {
            type:       'String',
        },
        colorTexto: {
            type:       'String',
        },
        alineacionContenido:{
            type:       'string',
            default:    'center'
        }
    },
    example: {},


    edit(props) {


        //console.log(props);
        //EXTRAER EL CONTENIDO DESDE PROPS
        const { attributes: {headingBox, textoBox, colorFondo, colorTexto, alineacionContenido}, setAttributes} = props;

        const onChangeHeadingBox = nuevoHeading => {
            setAttributes({ headingBox: nuevoHeading});
        }

        const onChangeTextoBox = nuevoTexto =>{
            setAttributes({ textoBox: nuevoTexto});
        }


        const onChangeColorFondo = nuevoColor =>{
            setAttributes({ colorFondo: nuevoColor});
        }

        const onChangeColorTexto = nuevoColorTexto =>{
            setAttributes({ colorTexto: nuevoColorTexto});
        }

        const onChangeAlinearContenido = nuevaAlineacion => {
            setAttributes({ alineacionContenido: nuevaAlineacion});
        }

        const blockProps = useBlockProps();
        return (
            <>

            <InspectorControls>
                <PanelBody title={'Color de Fondo'} initialOpen={true}>
                <div className='components-base-control'>
                    <div className='components-base-control__field'>
                        <label className='components-base-control__label'>
                            Color de fondo
                        </label>
                        <ColorPalette

                            onChange={onChangeColorFondo}
                            value={colorFondo}
                        
                        />
                    </div>
                </div>
                </PanelBody>

                <PanelBody title={'Color de Texto'} initialOpen={false}>
                <div className='components-base-control'>
                    <div className='components-base-control__field'>
                        <label className='components-base-control__label'>
                            Color de Texto
                        </label>
                        <ColorPalette
                            onChange={onChangeColorTexto}
                            value={colorTexto}
                        />
                    </div>
                </div>
                </PanelBody>

                <BlockControls>
                    <AlignmentToolbar
                        onChange={onChangeAlinearContenido}
                    />
                
                </BlockControls>       
                
            </InspectorControls>

                <div className='box' style={{backgroundColor: colorFondo, textAlign: alineacionContenido}}>
                        <h2 style={{color: colorTexto}}>
                        <RichText
                            { ...blockProps }
                                placeholder="Agrega el encabezado"
                                onChange={onChangeHeadingBox}
                                value={headingBox}
                        />
                        </h2>
                        <p style={{color: colorTexto}}>
                            <RichText
                                { ...blockProps }
                                    placeholder="Agrega el texto"
                                    onChange={onChangeTextoBox}
                                    value={textoBox}
                            />
                        </p>
                </div>
           </>
        );
    },

    save(props) {

        //EXTRAER EL CONTENIDO DESDE PROPS
        const { attributes: {headingBox, textoBox, colorFondo, colorTexto, alineacionContenido}} = props;

        const blockProps = useBlockProps.save();
        return (
        <div className='box' style={{backgroundColor: colorFondo, textAlign: alineacionContenido}}>
                <h2 style={{color: colorTexto}} ><RichText.Content { ...blockProps } value = {headingBox}/></h2>
                <p  style={{color: colorTexto}} ><RichText.Content { ...blockProps }value = {textoBox}/></p>
       </div>
        );
    },
} );