<template>
  <div>
    <div id="intro-section">
      <clouds
        v-if="showClouds"
        id="clouds_container"
        :animationStop="stopCloudAnimation"
      />
      <!-- <flight-fast v-if="showPaths" /> -->
      <div id="intro-text" class="page-section">
        <h1 class="title is-2 has-text-dark">
          ¿Y si prohibimos los vuelos cortos?
        </h1>
        <h2 class="title is-4 has-text-dark">
          Una exploración (pre-COVID) sobre los ahorros de emisiones y la
          aviación.
        </h2>
        <h2 class="title is-6 has-text-dark"></h2>

        <a class="button" href="#graphs1"> Empezar </a>
      </div>
    </div>
    <div class="container text-container " id="graphs1">
      <div class="text-column content">
        El impacto de la aviación en las emisiones de CO2
        <a href="https://ourworldindata.org/co2-emissions-from-aviation">
          supuso el 1.9% de emisiones a nivel mundial en 2018
        </a>
        y hasta la pandemia estaba en constante crecimiento Aunque la aviación se
        considera irremplazable para las distancias largas, en
        Francia se ha aprobado que
        <a
          href="https://www.xataka.com/ecologia-y-naturaleza/francia-aprueba-ley-que-prohibe-vuelos-domesticos-para-viajes-que-se-pueden-hacer-tren-dos-horas-media"
          target="_blank"
        >
          eliminar los vuelos que puedan ser realizados en tren
        </a>


        <blockquote>
          De media, cada viaje doméstico en tren emite
          <a href="https://ourworldindata.org/travel-carbon-footprint">
            una sexta parte del CO2
          </a>
         del mismo viaje en avión
        </blockquote>

        Además del impacto relativo de la medida, vamos el impacto real respecto
        al total de la aviación a partir de un ejemplo la distribución del
        tráfico aéreo en Madrid.

        <h2
          class="is-size-4 mt-4 has-text-weight-semibold"
          style="margin-top:1rem"
        >
          Vamos a analizar la lista de todos los vuelos que salieron de Madrid
          en la semana del 24 al 31 de enero.
        </h2>

        <h3 class="is-size-5 mt-4" style="margin-top:1rem">
          MUCHO OJO CON EXTRAPOLAR
        </h3>

        <p class="is-size-7 hast-text-weight-bold" style="line-height:120%;">
          La exploración que presento aquí utiliza un conjunto de datos
          circunstrito a un momento del año determinado y se centra sólo en uno
          de los aeropuertos de España, y en sus vuelos de salida. No es un trabajo acadédmico y
          necesitaría una revisión a conciencia que permitiera validar los datos
          y extrapolarlos estos datos a todo el año. <a href="#metodologia" class="is-size-7"> Aquí puedes leer del origen de los datos</a>
        </p>
      </div>
      <div id="scene1">
        <h2 class="title is-3 text-column">
          Destino de los {{ totalVuelos }} vuelos desde Madrid
        </h2>
        <p class="text-column">
       
        </p>
        <div id="buttons" style="margin-left:32px; margin-top:40px">
          <b-field class="has-text-centered  ">
            <b-radio-button v-model="bubbleMode" native-value="total_km">
              <span>Total de kilómetros recorridos</span>
            </b-radio-button>

            <b-radio-button v-model="bubbleMode" native-value="tonFuelTotales">
              <span>Toneladas de combustible quemadas</span>
            </b-radio-button>

            <b-radio-button v-model="bubbleMode" native-value="distance">
              Distancia a madrid
            </b-radio-button>

            <b-button
              @click="resetZoom = !resetZoom"
              style="margin-left:2rem"
              icon-left="restart"
              type="is-primary is-light"
            >
              Reset zoom
            </b-button>
          </b-field>
        </div>

        <bubble-plot
          :plot-data-original="this.vuelosCiudad_data"
          :mode="bubbleMode"
          v-bind:highlightAirport.sync="highlightAirport"
          :reset-zoom="resetZoom"
        />
        <dialog-drag
          :options="{
            width: diagramTooltipOptions.width,
            left: diagramTooltipOptions.left,
            top: diagramTooltipOptions.top,
            buttonPin: false,
            buttonClose: false,
            dragCursor: 'move'
          }"
          name="dialog-1"
          class="dialog-1"
        >
          <div class="text-column">
            <h2 class="is-size-7 has-text-weight-bold">
              ¿Como leer este gráfico?
            </h2>
            <ul class="micro-text-pinned">
              <transition name="slide">
                <li v-if="checkVisible(0)">
                  Cada burbuja es un <b> aeropuerto de destino. </b> Cuanto más
                  arriba está la burbuja más vuelos van desde Madrid a este
                  destino.
                </li>
              </transition>

              <transition name="slide">
                <li v-if="checkVisible(1)">
                  Cuanto <b> más a la derecha</b> está <b> más emisiones.</b>
                </li>
              </transition>

              <transition name="slide">
                <li v-if="checkVisible(2)">
                  El tamaño de la burbuja nos indica la distancia entre madrid y
                  ese destino. Y el color el continente al que pertenece.
                </li>
              </transition>

              <transition name="slide">
                <li v-if="checkVisible(3)">
                  ¡Por ejemplo! Desde Madrid vemos como el lugar a donde más se
                  vuela es Barcelona con ¡180! vuelos en esa semana.
                </li>
              </transition>

              <transition name="slide">
                <li v-if="checkVisible(4)">
                  Abajo a la izquierda podemos ver una piscina de bolas de
                  destinos a los que se vuela menos de 30 veces y que consumen
                  menos de 80000 kg de combustible
                </li>
              </transition>
              <transition name="slide">
                <li v-if="checkVisible(5)">
                  Pero también podemos ver claramente unos cuantos destinos que
                  multiplican el el consumo. El destino en el que más emisiones
                  se generan es el aeropuerto de ciudad de México.
                </li>
              </transition>
              <transition name="slide">
                <li v-if="checkVisible(6)">
                  Puedes cambiar la forma en que se ordenan los aeropuertos por
                  distancia a Madrid, Por combustible gastado, y por el total de
                  kilómetros recorridos
                </li>
              </transition>
              <transition name="slide">
                <li v-if="checkVisible(7)">
                  Puedes seleccionar una zona del gráfico para hacer zoom sobre
                  ella. Doble click para volver a la vista inicial
                </li>
              </transition>
            </ul>
          </div>
        </dialog-drag>
      </div>
      <section class="section is-medium">
        <h2 class="title is-3 text-column">
          Repartiendo culpas
        </h2>
        <div class="text-column">
          Si clasificamos los vuelos en tres categorías: vuelos nacionales. 10
          destinos que más combustible/CO2 necesitan y resto. Nos queda algo
          así.
          <!--- gráfica aqui -->
          <simple-bar-chart :chart-data="barChartData"> </simple-bar-chart>
        </div>
        <b-collapse :open="false" aria-id="contentIdForA11y1">
          <a
            slot="trigger"
            aria-controls="contentIdForA11y1"
            slot-scope="props"
            class="text-column"
            style="display:block; margin-top:1rem;"
          >
            <b-icon :icon="!props.open ? 'menu-down' : 'menu-up'"></b-icon>
            Desplegar tabla con los principales destinos internacionales y
            nacionales
          </a>
          <h2 class="title is-3">
            Vuelos internacionales
          </h2>

          <b-table
            :data="statistics.top10"
            :columns="columns"
            :pagination-simple="true"
          ></b-table>
          <h2 class="title is-3">
            Vuelos Nacionales
          </h2>
          <b-table
            :data="statistics.top20España"
            :columns="columns_nacionales"
            :paginated="true"
            :per-page="10"
          ></b-table>
        </b-collapse>
      </section>
      <section class="section text-column">
        <h2 class="title is-3">
          Escenarios
        </h2>
        <div class="content ">
          <blockquote>
          Algunos datos para contextualizar:
          <ul class="traditional">
            <li>
              El transporte aéreo nacional
              <a
                href="https://www.miteco.gob.es/es/prensa/ultimas-noticias/las-emisiones-de-co2-disminuyen-en-espa%C3%B1a-un-22-en-2018-con-respecto-al-a%C3%B1o-anterior/tcm:30-497589"
                target="_blank"
              >
                contribuye aproximadamente con un 0,9% del total de
                emisiones,</a
              >
              aunque aumentó un 10% en un año
            </li>
            <li>
              Esto no incluye los vuelos con origen España y destino otro país.
              Estos datos son más dificiles de encontrar, pero calculando sale
              un 5%
              <b-collapse
                :open="false"
                position="is-bottom"
                aria-id="contentIdForA11y2"
              >
                <a
                  slot="trigger"
                  slot-scope="props"
                  aria-controls="contentIdForA11y2"
                >
                  <b-icon
                    :icon="!props.open ? 'menu-down' : 'menu-up'"
                  ></b-icon>
                  {{
                    !props.open
                      ? "Mostrar datos de estimación"
                      : "ocultar estimación"
                  }}
                </a>
                
                  <li>
                    Las emisiones netas fueron en
                    <a
                      href="https://www.miteco.gob.es/es/prensa/ultimas-noticias/las-emisiones-de-co2-disminuyen-en-espa%C3%B1a-un-22-en-2018-con-respecto-al-a%C3%B1o-anterior/tcm:30-497589"
                      >2018 de 295 millones de Ton de CO2 Equiv. (netas
                      descontando absorciones)</a
                    >
                  </li>
                  <li>
                    Segun
                    <a
                      href="https://es.statista.com/estadisticas/497147/volumen-de-emisiones-generado-por-la-aviacion-internacional-en-espana/"
                      >Statista las emisiones de la aviación int fueron:
                    </a>
                    17065 miles de toneladas. Obtenemos alrededor de un 5%! de
                    emisiones
                  </li>
                
              </b-collapse>
            </li>
            <li>
              El
              <a
                href="https://www.europarl.europa.eu/news/es/headlines/society/20180208STO97442/reduccion-de-emisiones-en-la-ue-objetivos-nacionales-para-2030"
                target="_blank"
              >
                objetivo vinculante</a
              >
              de reducción de emisiones de ESpaña para 2030 es del <b>26%</b>
            </li>
          </ul>
          </blockquote>

         Hay que recortar emisiones de todos lados, cada décima cuenta. ¿Qué harías?
        </div>
        Mira dos opciones:
        <ul>
          <li>
            a) Vamos a recortar un 50% el número de vuelos hacia los 10 destinos
            que más Co2 emiten
          </li>
          <li>
            b) Mejoramos la infraestructura ferroviaria. Los vuelos de Madrid a
            la península se reducen un 90%
          </li>
        </ul>
        
        
          <b-field  position="is-centered">
            <b-radio-button type="is-primary" v-model="scenarioId" native-value="A">
              <span>Recortar 50% vuelos más contaminantes</span>
            </b-radio-button>

            <b-radio-button v-model="scenarioId" native-value="B">
              <span>A muerte con el tren en la peninsula</span>
            </b-radio-button>
          </b-field>
      
        <simple-bar-chart
          :chart-data="barChartDataAhorroNacional"
          v-if="scenarioId === 'A'"
        >
        </simple-bar-chart>
        <simple-bar-chart
          :chart-data="barChartDataAhorroInternacional"
          v-if="scenarioId === 'B'"
        >
        </simple-bar-chart>
      </section>

      <section class="section text-column content">
        <h2 class="title is-3">
          Cierre
        </h2>

        <ul>
          <li>
            El % de impacto relativo sobre el transporte será muy poco. Pero cada grado cuenta.
          </li>
          <li>
            España ya ha construido una infraestructura de alta
            velocidad por todo el país que es deficitiaria y hay que exprimir
          </li>
          <li>
            Es un cambio relatiavmente fácil que no supone un golpe a nuestro
            "modo de vida"
          </li>
          <li>Pero a la vez manda un mensaje de autolimitación: ya no vale todo.</li>
        </ul>

        Para reducir el impacto de los trayectos interncionales no hay alternativa: menos gente de viaje y menos vuelos.

        <p></p>
      </section>

      <section class="text-column content" id="metodologia">
         <h2 class="title is-3">
          Datos y metodología
        </h2>
               <p>
             
          
         </p>
         <ul>
           
           <li> Datos descargados desde <a href="https://aviation-edge.com" target="_blank"> https://aviation-edge.com </a> Se descargaban periódicamente todos los vuelos programados para salir y posteriormente se unieron todos los datos borrando los duplicados </li>
           <li> Datos de distancia, fuel consumido y CO2 obtenidos mediante el scrapping de: <a href="https://applications.icao.int/icec"> https://applications.icao.int/icec </a> |  <a href="https://gist.github.com/serman/1860f0a7c62c4881780652f18b7070a9"> (Descarga el código que hice para hacer scrapping) </a></li>
           <li> Los datos de una semana en Madrid no son extrapolables a todos los aeropuertos de la peninsula en todo el año. </li>
           <li> Este proyecto es un experimento, un juego, no un paper científico, si crees que hay datos que no son verosímiles por favor escribeme</li>
        </ul>
      </section>
    </div>
    <div id="footer"></div>
  </div>
</template>

<script>
import Clouds from "~/components/Clouds";
//<!--import FlightFast from '~/components/FlightFast' -->
import bubblePlot from "~/components/bubblePlot";
import SimpleBarChart from "~/components/SimpleBarChart";
import DialogDrag from "vue-dialog-drag";
import Vue from "vue";
import * as d3 from "d3";
import { slugify } from "@/assets/libs/slugify.js";

export default {
  name: "HomePage",
  components: {
    Clouds,
    //FlightFast,
    bubblePlot,
    SimpleBarChart,
    DialogDrag
  },
  data() {
    return {
      showClouds: true,
      stopCloudAnimation: false,
      showPaths: false,
      currentTextOnDisplay: 0,
      vuelosCiudad_data: [],
      bubbleMode: "total_km",
      highlightAirport: "",
      scenarioId: null,
      resetZoom: false,
      columns: [
        {
          field: "nombre",
          label: "Aeropuerto",
          numeric: false
        },
        {
          field: "pais",
          label: "País",
          numeric: false
        },
        {
          label: "Número de vuelos",
          field: "count",
          numeric: true
        },
        {
          field: "kgFuelTotales",
          label: "kg Combustible consumidos",
          numeric: true
        },
        {
          field: "continente",
          label: "Continente",
          numeric: false
        }
      ],
      columns_nacionales: [
        {
          field: "nombre",
          label: "Aeropuerto",
          numeric: false
        },
        {
          label: "Número de vuelos",
          field: "count",
          numeric: true,
          sortable: true
        },
        {
          field: "kgFuelTotales",
          label: "kg Combustible consumidos",
          numeric: true,
          sortable: true
        }
      ]
    };
  },
  mounted() {
    window.d3 = d3;
    console.log(Vue.version);
    this.setPins();
    this.getData();
  },
  computed: {
    statistics() {
      let kgFuelEspaña = d3.sum(
        this.vuelosCiudad_data.filter(d => d.continente == "ES"),
        d => d.kgFuelTotales
      );
      let kgFuelTotales = d3.sum(this.vuelosCiudad_data, d => d.kgFuelTotales);
      let porcentajeNacional = kgFuelEspaña / kgFuelTotales;
      let top10 = this.vuelosCiudad_data
        .sort((a, b) => d3.descending(a.kgFuelTotales, b.kgFuelTotales))
        .slice(0, 10);
      let top20España = this.vuelosCiudad_data
        .filter(d => d.continente == "ES")
        .sort((a, b) => d3.descending(a.kgFuelTotales, b.kgFuelTotales))
        .slice(0, 20);
      let kgFuelTop10 = d3.sum(top10, d => d.kgFuelTotales);
      let porcentajeTop10 = kgFuelTop10 / kgFuelTotales;

      //eliminamos lo de las islas
      let islas = [
        "Palma",
        "Tenerife",
        "Ibiza",
        "Lanzarote",
        "Canaria",
        "Fuerteventura"
      ];
      let topSpainNoIsland = [];
      top20España.forEach(dst => {
        if (!islas.some(v => dst.nombre.includes(v))) {
          topSpainNoIsland.push(dst);
        }
      });
      topSpainNoIsland = topSpainNoIsland.slice(0, 10);
      let kgFuelTop10EspaniaSinIslas = d3.sum(
        topSpainNoIsland,
        d => d.kgFuelTotales
      );
      let porcentajeTop10EspaniaSinIslas =
        kgFuelTop10EspaniaSinIslas / kgFuelTotales;
      return {
        kgFuelEspaña,
        kgFuelTotales,
        porcentajeNacional,
        porcentajeTop10,
        top20España,
        top10,
        topSpainNoIsland,
        porcentajeTop10EspaniaSinIslas
      };
    },
    barChartData() {
      return [
        {
          tag: "nacional",
          percentage: (this.statistics.porcentajeNacional * 100).toFixed(1),
          color: "#EB5757"
        },
        {
          tag: "top10",
          percentage: (this.statistics.porcentajeTop10 * 100).toFixed(1),
          color: "#2D9CDB"
        },
        {
          tag: "resto",
          percentage: (
            100 -
            (this.statistics.porcentajeTop10 * 100 +
              this.statistics.porcentajeNacional * 100)
          ).toFixed(1),
          color: "#aaaaaa"
        }
      ];
    },
    barChartDataAhorroNacional() {
      return [
        {
          tag: "Nacional",
          percentage: (
            (this.statistics.porcentajeNacional -
              this.statistics.porcentajeTop10EspaniaSinIslas) *
            100
          ).toFixed(1),
          color: "#2D9CDB"
        },
        {
          tag: "Ahorro sin vuelos peninsulares",
          percentage: (
            this.statistics.porcentajeTop10EspaniaSinIslas * 100
          ).toFixed(1),
          color: "#EB5757"
        },

        {
          tag: "Resto",
          percentage: (100 - this.statistics.porcentajeNacional * 100).toFixed(
            1
          ),
          color: "#aaaaaa"
        }
      ];
    },
    barChartDataAhorroInternacional() {
      return [
        {
          tag: "Ahorro recortando top10 al 50%",
          percentage: (this.statistics.porcentajeTop10 * 0.5 * 100).toFixed(1),
          color: "#EB5757"
        },
        {
          tag: "top10",
          percentage: (this.statistics.porcentajeTop10 * 0.5 * 100).toFixed(1),
          color: "#2D9CDB"
        },
        {
          tag: "resto",
          percentage: (
            100 -
            (this.statistics.porcentajeTop10 * 100 +
              this.statistics.porcentajeNacional * 100)
          ).toFixed(1),
          color: "#aaaaaa"
        }
      ];
    },
    diagramTooltipOptions() {
      return {
        width: 600,
        left: window.innerWidth - 600 - 200,
        top: window.innerHeight / 2
      };
    },
    totalVuelos() {
      return d3.sum(this.vuelosCiudad_data, d => d.count);
    }
  },
  methods: {
    getData() {
      d3.csv("./vuelosCiudad_data_madrid_completos.csv", function(d) {
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
          tonFuelTotales: parseInt(d.kgFuelTotales) / 1000
        };
      }).then(data => {
        this.vuelosCiudad_data = data;
        console.log("init plot");
        console.log(data);
      });
    },
    checkVisible(indx) {
      return this.currentTextOnDisplay === indx;
    },
    setPins() {
      const scenea = this.$scrollmagic
        .scene({
          triggerElement: "#scene1",
          triggerHook: 0.0,
          duration: "700%",
          pushFollowers: true
        })
        .setPin("#scene1")
        .on("progress", e => {
          this.currentTextOnDisplay = Math.round(e.progress * 7);
          if (this.currentTextOnDisplay == 3) {
            this.highlightAirport = ".barcelona-international-airport";
          } else if (this.currentTextOnDisplay == 5) {
            this.highlightAirport =
              ".licenciado-benito-juarez-international-airport";
          } else {
            this.highlightAirport = "";
          }
        });
      this.$scrollmagic.addScene(scenea);
      const sceneb = this.$scrollmagic
        .scene({
          triggerElement: "#graphs1"
        })
        .on("enter leave", e => {
          console.log("type:" + e.type);
          if (e.type == "leave") {
            this.stopCloudAnimation = false;
          }
          if (e.type == "enter") {
            this.stopCloudAnimation = true;
          }
        });
      this.$scrollmagic.addScene(sceneb);
    }
  }
};
</script>
<style src="vue-dialog-drag/dist/vue-dialog-drag.css"></style>
<style src="vue-dialog-drag/dist/dialog-styles.css"></style>
<style lang="css">
html {
  scroll-behavior: smooth;
}
body {
  background-color: #ffffff; /*326696*/
  margin: 0px;
  overflow: hidden;
  font-family: "open sans", "helvetica", sans-serif;
  font-size: 19px;
  text-align: center;
  font-weight: normal;
  text-align: left;
}
#graphs1 {
  padding-top: 10vh;
}
#intro-section {
  height: 100vh;
  margin-bottom: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
#intro-text {
  text-align: center;
  padding-top: 10vh;
}
/* .text-column-container{
    text-align: center;
  } */
.text-column {
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 170%;
}

a {
  color: #0078ff;
}

.page-section {
  position: relative;
  z-index: 10;
}

.slide-enter-active {
  transition: all .3s ease;
}
.slide-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-enter, .slide-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}

/* .micro-text-pinned li {
  position:absolute;
  transition: all 1s;
  display: block;

}

.micro-text-pinned li.is-visible {
  opacity: 1;
  transform: translate(0, 0);
}
.micro-text-pinned li.not-visible {
  opacity:0;
  transform: translate(0, 150px);
} */

#footer {
  height: 300px;
}
ul.traditional li {
  margin-left: 2em;
  margin-bottom: 1em;
  list-style-type: disc;
}
.dialog-1.dialog-drag {
  background-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0px 0px 19px 4px rgb(0 0 0 / 10%)
}
.dialog-1.dialog-drag .dialog-header {
  background-color: transparent;
}
.dialog-1.dialog-drag {
  border: #84b5b2 dashed 2px;
}
</style>
