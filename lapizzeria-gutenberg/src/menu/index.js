import { registerBlockType } from '@wordpress/blocks';
import { withSelect } from '@wordpress/data';
import { RichText, InspectorControls} from "@wordpress/block-editor";
import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components';



import { ReactComponent as Logo } from '../pizzeria-icon.svg';


registerBlockType('lapizzeria/menu',{

    apiVersion: 2,
    title: 'La pizzeria Menu',
    icon: { src: Logo },
    category: 'lapizzeria',
    attributes:{
        cantidadMostrar: {
            type: 'number',
        
        },
        categoriaMenu:{
            type: 'number',
        },

        tituloBloque:{
            type: 'string',
            default:'Titulo Bloque'
        }
    },

    edit: withSelect((select, props) => {

        //Extraer los Valores
        const {attributes: {cantidadMostrar, categoriaMenu}, setAttributes} = props;

        const onChangeCantidadMostrar = nuevaCantidad =>{
           setAttributes({cantidadMostrar: parseInt(nuevaCantidad)})
        }

        const onChangeCategoriaMenu = nuevaCategoria => {
            setAttributes({categoriaMenu: nuevaCategoria})
        }

        const onChangeTituloBloque = nuevoTitulo =>{
            setAttributes({tituloBloque: nuevoTitulo})
        }

        return{
            
            categorias: select("core").getEntityRecords('taxonomy', 'categoria-menu'),
            //Enviar una peticion a la API
            especialidades: select("core").getEntityRecords('postType', 'especialidades',{
                'categoria-menu' : categoriaMenu,
                per_page: cantidadMostrar || 4 
                //pasar funciones al otro scope
            }), 
            onChangeCantidadMostrar,
            onChangeCategoriaMenu,
            onChangeTituloBloque,
            props
        };
    })

    (({especialidades, onChangeCantidadMostrar, onChangeCategoriaMenu, onChangeTituloBloque, props, categorias}) =>{
        console.log(categorias);

        //Extraer los props  
        const {attributes: {cantidadMostrar,tituloBloque, categoriaMenu}} = props;

        //Verificar Especialidades
        if(!especialidades){
            return 'Cargando....';
        }

        //Si no hay especialidades
        if(especialidades && especialidades.length === 0){
            return 'No hay resultados';
        }

        //Verificar Categorias
        if(!categorias){
            console.log('No hay categorias')
        }

        if(categorias && categorias.length === 0){
            console.log('No hay resultados')
        }



        //generar Label y Value a Categorias
        categorias.forEach(categoria => {
            categoria['label'] = categoria.name;
            categoria['value'] = categoria.id;
        });

        const opcionDefault = [{value:'', label:'--Todos--'}];

        const listadoCategorias = [...opcionDefault, ...categorias];
        
        return(
            <>  

             
            <InspectorControls>
                <PanelBody title={'Cantidad a Mostrar'} initialOpen={true}>
                <div className='components-base-control'>
                    <div className='components-base-control__field'>
                        <label className='components-base-control__label'>
                            Cantidad a Mostrar
                        </label>
                        <RangeControl
                            onChange={onChangeCantidadMostrar}
                            min={2}
                            max={10}
                            value={cantidadMostrar || 4 }
                        />
                    </div>
                </div>
                </PanelBody>  




                <PanelBody title={'Categoria de Especialidad'} initialOpen={false}>
                <div className='components-base-control'>
                    <div className='components-base-control__field'>
                        <label className='components-base-control__label'>
                            Cantegoria de Especialidad
                        </label>
                        <SelectControl
                             options={categorias}
                             onChange={onChangeCategoriaMenu}
                             value={cantidadMostrar}
                        />
                    </div>
                </div>
                </PanelBody>   




                <PanelBody title={'Titulo Bloque'} initialOpen={false}>
                <div className='components-base-control'>
                    <div className='components-base-control__field'>
                        <label className='components-base-control__label'>
                            Cantegoria de Especialidad
                        </label>
                        <TextControl
                            onChange={onChangeTituloBloque}
                            value={tituloBloque}
                        />
                    </div>
                </div>
                </PanelBody>  

            </InspectorControls>

                <h2 className='titulo-menu'>{tituloBloque}</h2>
                <ul className='nuestro-menu'>
                  {especialidades?.map(especialidad => (
                    <li>
                        <img src={especialidad.imagen_destacada}/>
                        <div className='platillo'>
                            <div className='precio-titulo'>
                                <h3>{especialidad.title.rendered}</h3>
                                <p>${especialidad.precio}</p>
                            </div>
                            <div className='contenido-platillo'>
                                <p>
                                    <RichText.Content  value = {especialidad.content.rendered.substring(0,180)}/>
                                </p>
                            </div>
                        </div>
                    </li>
                  ))}
                </ul>
            </>    
        )

    }),
    save:() => {
        return null;
    }
})