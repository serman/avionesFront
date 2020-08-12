<template>
  <div>
    <div id="intro-section" style="display:none">
      <flight-fast v-if="showPaths" />
      <clouds v-if="showClouds"/>
      
      <div id="intro-text" class="page-section">
          <h1 class="title is-2 has-text-light"> ¿Prohibimos los vuelos cortos? </h1>
          <h2 class="title is-4 has-text-light"> Una exploración pre-COVID sobre los ahorros de emisiones y la aviación.  </h2>
          <h2 class="title is-6 has-text-light"> </h2>

          <a class="button" href="#graphs1"> Empezar </a>
      </div>
    </div>
    <div class="container text-container " id="graphs1">
      <div class="text-column" style="display:none">
        El impacto de la aviación en las emisiones de CO2 ha ido cobrando mayor importancia en los últimos años y supone el XX de emisiones a nivel mundial pero en constante crecimiento

        La aviación se considera irremplazable para las distancias largas.
        Sin embargo en algunos países se ha planteado la opción de eliminar los vuelos que puedan ser realizados en tren como primer paso para reducir emisiones.
        Más allá del impacto simbólico de esta medida vamos a explorar el impacto real a partir de un ejemplo la distribución del tráfico aéreo en españa y el impacto de emisiones.
        <h3 class=" is-5"> Disclaimer </h3>
        <p class="is-size-7" style="line-height:120%;">
          El presenta artículo utiliza un conjunto de datos circunstrito a un momento del año determinado y se centra sólo en uno de los aeropuertos. 
          No es un trabajo acadédmico y necesitaría una revisión sistemática que permitiera extrapolar estos datos a todo el año. Si te interesa conocer la metodología pincha aquí.
        </p>
      </div>
      <div id="scene1"> 
         <b-field class="has-text-centered">
            <b-radio-button v-model="bubbleMode"
                native-value="total_km"
                >
                <span>total_km</span>
            </b-radio-button>

            <b-radio-button v-model="bubbleMode"
                native-value="tonFuelTotales"
                >
                <span>tonFuelTotales</span>
            </b-radio-button>

            <b-radio-button v-model="bubbleMode"
                native-value="distance">
                distancia
            </b-radio-button>
         </b-field>
        <bubble-plot :plot-data-original="this.vuelosCiudad_data" :mode="bubbleMode"  v-bind:highlightAirport.sync="highlightAirport"/>
        <dialog-drag :options="{width:diagramTooltipOptions.width, left:diagramTooltipOptions.left, top: diagramTooltipOptions.top, buttonPin:false, buttonClose:false, dragCursor:'move'}" name="dialog-1" class="dialog-1">
          <div class="text-column">
            <h2 class="is-size-7 has-text-weight-bold"> ¿Como leer este gráfico? </h2>
            <ul class="micro-text-pinned">
              <li :class="{'is-visible':checkVisible(0)}" > Cada burbuja es un <b> aeropuerto de destino. </b> Cuanto más arriba está la burbuja más vuelos van desde Madrid a este destino. </li>
              <li :class="{'is-visible':checkVisible(1)}" > Cuanto <b> más a la derecha</b> está <b> más emisiones.</b> </li>
              <li :class="{'is-visible':checkVisible(2)}" > El tamaño de la burbuja nos indica la distancia entre madrid y ese destino. Y el color el continente al que pertenece.</li>
                
              <li :class="{'is-visible':checkVisible(3)}" > ¡Por ejemplo!
              Desde Madrid vemos como el lugar a donde más se vuela es Barcelona con ¡180! vuelos en esa semana (marcar Barcelona). </li>
              
              <li :class="{'is-visible':checkVisible(4)}" > Abajo a la izquierda podemos ver una piscina de bolas de destinos a los que se vuela menos de 30 veces y que consumen menos de 80000 kg de combustible </li>
              
              <li :class="{'is-visible':checkVisible(5)}" > Pero también podemos ver claramente unos cuantos destinos que multiplican el el consumo.
              El destino en el que más emisiones se generan es el aeropuerto de ciudad de México. </li>
            </ul> 
          </div>
        </dialog-drag>
      </div>
      <section>
        <h2 class="title is-3">
          Repartiendo culpas
        </h2>
        <div class="text-column">          
        Si clasificamos los vuelos en tres categorías: vuelos nacionales. 10 destinos que más combustible/CO2 necesitan y resto. Nos queda algo así.
        <!--- gráfica aqui -->
        <simple-bar-chart :chart-data="barChartData"> </simple-bar-chart> 
        </div>
        <h2 class="title is-3">
          Vuelos internacionales           
        </h2>
        <b-table :data="statistics.top10" :columns="columns"></b-table>
        <h2 class="title is-3">
          Vuelos Nacionales           
        </h2>
        <b-table :data="statistics.top20España" :columns="columns_nacionales" :paginated="true"
            :per-page="10"></b-table>
      </section >
      <section>
        <h2 class="title is-3">
          Escenarios
        </h2>
        <div class="text-column"> 
          Algunos datos para contextualizar:
          <ul class="traditional">
          <li> El transporte aéreo nacional <a href="https://www.miteco.gob.es/es/prensa/ultimas-noticias/las-emisiones-de-co2-disminuyen-en-espa%C3%B1a-un-22-en-2018-con-respecto-al-a%C3%B1o-anterior/tcm:30-497589" target="_blank"> contribuye aproximadamente con un 0,9% del total de emisiones,</a> aunque aumentó un 10% en un año </li>
          <li>Esto no incluye los vuelos con origen España y destino otro país. Estos datos son más dificiles de encontrar, pero calculando sale un 5%
          <b-collapse :open="false" position="is-bottom" aria-id="contentIdForA11y1">
              <a slot="trigger" slot-scope="props" aria-controls="contentIdForA11y1">
                  <b-icon :icon="!props.open ? 'menu-down' : 'menu-up'"></b-icon>
                  {{ !props.open ? 'Mostrar datos de estimación' : 'ocultar estimación' }}
              </a>
              <p>
                  <li> 
                    Las emisiones netas fueron  en <a href="https://www.miteco.gob.es/es/prensa/ultimas-noticias/las-emisiones-de-co2-disminuyen-en-espa%C3%B1a-un-22-en-2018-con-respecto-al-a%C3%B1o-anterior/tcm:30-497589">2018 de 295 millones de Ton de CO2 Equiv. (netas descontando absorciones)</a>
                  </li>
                  <li> 
                    Segun  <a href="https://es.statista.com/estadisticas/497147/volumen-de-emisiones-generado-por-la-aviacion-internacional-en-espana/">Statista las emisiones de la aviación int fueron:  </a> 17065 miles de toneladas. Obtenemos  alrededor de un 5%! de emisiones
                  </li>
              </p>
          </b-collapse>
          </li>
          <li>El <a href="https://www.europarl.europa.eu/news/es/headlines/society/20180208STO97442/reduccion-de-emisiones-en-la-ue-objetivos-nacionales-para-2030" target="_blank">
          objetivo vinculante</a>   de reducción de emisiones de ESpaña para 2030 es del <b>26%</b> </li>
          </ul>
          Venga, eres la ministra de transporte. Hay que recortar emisiones de todos lados, cada décima cuenta. ¿Qué haces?
        </div>
        Te damos tres opciones:
        <ul>
          <li> Vamos a recortar un 50% el número de vuelos hacia los destinos que más Co2 emiten </li>
          <li> Vamos a recortar un 50% el número de vuelos hacia los destinos más contaminantes </li>
          <li> Mejoramos la infraestructura ferroviaria. Los vuelos de madrid a cualquier otro punto se reducen un 80% ¿Cuanto se ahorra?</li>
        </ul>
      </section>

      <section>
        <h2 class="title is-3">
          Cierre
        </h2>
          Cabe señalar que los datos de una semana en Madrid no son extrapolables a todos los aeropuertos de la peninsula en todo el año. 
          Esto puede verse comparando nuestro dato medido de 10% de en vuelos nacionales vs 90% en vuelos internacionales no coincide con la estimación 0,9%total nacionales -5% total int.

          Sin embargo si que podemos extraer una conclusion: Eliminar vuelos que puedan reemplazarse por tren supondrá seguro un ahorro de emisiones, pero muy pequeño: Extrapolando nuestro ejemplo de Madrid  al 0,9% de emisiones asociadas a vuelos nacionales, esa reducción actuaría sobre un pequeño 0,4% de las emisiones totales del país.

      </section>
    </div>
    <div id="footer">
    </div>
  </div>
</template>

<script>
import Clouds from '~/components/Clouds'
import FlightFast from '~/components/FlightFast'
import bubblePlot from '~/components/bubblePlot'
import SimpleBarChart from '~/components/SimpleBarChart'
import DialogDrag from 'vue-dialog-drag'
import Vue from 'vue'
import * as d3 from "d3";
import {slugify} from '@/assets/libs/slugify.js'


export default {
  name: 'HomePage',
  components: {
    Clouds,
    FlightFast,
    bubblePlot,
    SimpleBarChart,
    DialogDrag
  },
  data() {
    return {
      showClouds: false,
      showPaths: false,
      currentTextOnDisplay:0,
      vuelosCiudad_data:[],
      bubbleMode:'total_km',
      highlightAirport:'',
      columns: [
        {
          field: 'nombre',
          label: 'Aeropuerto',
          numeric: false
        },
        {
          field: 'pais',
          label: 'País',
          numeric: false
        },
        {
          label: 'Número de vuelos',
          field: 'count',
          numeric: true
        },
        {
          field: 'kgFuelTotales',
          label: 'kg Combustible consumidos',
          numeric: true
        },
        {
          field: 'continente',
          label: 'Continente',
          numeric: false
        }
      ],
      columns_nacionales: [
        {
          field: 'nombre',
          label: 'Aeropuerto',
          numeric: false
          
        },
        {
          label: 'Número de vuelos',
          field: 'count',
          numeric: true,
          sortable:true
        },
        {
          field: 'kgFuelTotales',
          label: 'kg Combustible consumidos',
          numeric: true,
          sortable:true
        },

      ]
    }
  },
  mounted () {
    console.log(Vue.version)
    this.setPins()
    this.getData()
  },
  computed: {
    statistics() {      
        let kgFuelEspaña=d3.sum(this.vuelosCiudad_data.filter(d=>d.continente=='ES'),d=>d.kgFuelTotales)
        let kgFuelTotales=d3.sum(this.vuelosCiudad_data,d=>d.kgFuelTotales)
        let porcentajeNacional= kgFuelEspaña/kgFuelTotales
        let top10= this.vuelosCiudad_data.sort((a, b) => d3.descending(a.kgFuelTotales, b.kgFuelTotales)).slice(0,10)
        let top20España= this.vuelosCiudad_data.filter(d=>d.continente=='ES').sort((a, b) => d3.descending(a.kgFuelTotales, b.kgFuelTotales)).slice(0,20)
        let  kgFuelTop10 = d3.sum(top10,d=>d.kgFuelTotales)
        let porcentajeTop10 = kgFuelTop10/ kgFuelTotales

        //eliminamos lo de las islas
        let islas=['Palma','Tenerife','Ibiza','Lanzarote','Canaria','Fuerteventura']
        let topSpainNoIsland=[]
        top20España.forEach(dst=>{
        if(! islas.some(v=> dst.nombre.includes(v)) ){
          topSpainNoIsland.push(dst)
        }
        })
        topSpainNoIsland=topSpainNoIsland.slice(0,10)      
        let kgFuelTop10EspaniaSinIslas = d3.sum(topSpainNoIsland,d=>d.kgFuelTotales )
        let porcentajeTop10EspaniaSinIslas = kgFuelTop10EspaniaSinIslas / kgFuelTotales    
        return {kgFuelEspaña, kgFuelTotales,porcentajeNacional,porcentajeTop10,top20España, top10, topSpainNoIsland,porcentajeTop10EspaniaSinIslas  }
    },
    barChartData(){
      return [
          {
            tag: 'nacional',
            percentage: (this.statistics.porcentajeNacional*100).toFixed(1),
            color: '#EB5757'        
          },
          {
            tag: 'top10',
            percentage: (this.statistics.porcentajeTop10*100).toFixed(1),
            color: '#2D9CDB'        
          },
          {
            tag: 'resto',
            percentage: (100-(this.statistics.porcentajeTop10*100+this.statistics.porcentajeNacional*100)).toFixed(1),
            color: '#aaaaaa'        
          }
      ]
    },
    diagramTooltipOptions(){
      return {
        width:600,
        left:window.innerWidth-600-200,
        top: window.innerHeight/2
      } 
    } 
  },
  methods: {
    getData(){
      d3.csv(
        "/vuelosCiudad_data_madrid_completos.csv",
        function(d) {
          return {
            iata: d.iata, // convert "Year" column to Date
            total_km: parseInt(d.total_km),
            distance: parseInt(d.distance),
            count: parseInt(d.count),
            nombre: d.nombre, // 
            continente: d.continente,
            pais: d.pais,
            nombre_slug: slugify(d.nombre),
            kgFuelTotales: parseInt(d.kgFuelTotales),
            tonFuelTotales: parseInt(d.kgFuelTotales)/1000
          }
        })
        .then((data)=> {
          this.vuelosCiudad_data=data
          console.log('init plot')
          console.log(data)
        })
    },
    checkVisible(indx){
      return this.currentTextOnDisplay === indx
    },
    setPins() {
      const scenea = this.$scrollmagic
        .scene({
          triggerElement: '#scene1',
          triggerHook: 0.0,
          duration: '200%',
          pushFollowers: true
        })
        .setPin('#scene1')
         .on('progress', (e) => {
           
            this.currentTextOnDisplay = Math.round(e.progress*6)
            Math.round(e.progress*6)
            if(this.currentTextOnDisplay==3){
              this.highlightAirport='.barcelona-international-airport'
            }
            else if(this.currentTextOnDisplay == 5){
              this.highlightAirport='.licenciado-benito-juarez-international-airport'
            }
            else{
              this.highlightAirport=''
            }
          })
        // actions for each msgs
        

        //.setClassToggle('#reveal1', 'visible')
      this.$scrollmagic.addScene(scenea)
    }
  },
}
</script>
<style src='vue-dialog-drag/dist/vue-dialog-drag.css'></style>
<style src="vue-dialog-drag/dist/dialog-styles.css"></style>
<style lang="css">
html{
  scroll-behavior: smooth;
}
body {
    background-color: #ffffff; /*326696*/
    margin: 0px;
    overflow: hidden;
    font-family:'open sans', 'helvetica', sans-serif;
    font-size:19px;
    text-align:center;
    font-weight:normal;
    text-align:left;
    
  }
  #graphs1{
    padding-top:10vh;
  }
  #intro-section{
    height:100vh;
    margin-bottom:10vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  #intro-text{
    text-align:center;
    
    
  }
  /* .text-column-container{
    text-align: center;
  } */
  .text-column{
    max-width:700px;
    margin-left:auto; 
    margin-right:auto;
    line-height: 170%;
  }

  a {
    color:#0078ff;
  }

  .page-section{
    position: relative;
    z-index: 10;;
  }

  .micro-text-pinned li{
    display: none
  }
  .micro-text-pinned li.is-visible{
    display: block
  }
  #footer{
    height: 300px;;
  }
  ul.traditional li{
    margin-left:2em;
    margin-bottom:1em;
    list-style-type: disc;
  }
  .dialog-1.dialog-drag {
    background-color: rgba(255,255,255,0.8)!important
  }
</style>