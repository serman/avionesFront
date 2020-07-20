<template>
  <div>
    <div id="background">
      <div v-for="data in chartData" :key="data.tag" :style="{width: getWidth(data.percentage), 'background-color':data.color}" class="barchart-inner"> </div>
    </div>
    <div class="is-flex">
      <div v-for="data in chartData" :key="data.tag" :style="{'min-width': getWidth(data.percentage),'color':data.color}" class="barchart-tag">
        {{data.percentage}}% {{data.tag}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      chartData: {
        type: Array,
        default: [
          {
            tag: 'nacional',
            percentage: 4,
            color: '#EB5757'        
          },
          {
            tag: 'top10',
            percentage: 46,
            color: '#2D9CDB'        
          },
          {
            tag: 'resto',
            percentage: 50,
            color: '#aaaaaa'        
          }
        ]
      },
    },
    data() {
      return {
        graphWidth: 500,

      }
    },
    methods: {
      getWidth(percentage) {
        return (percentage/100)*this.graphWidth+'px'
      }
      
    },
  }
</script>

<style lang="scss" scoped>

.barchart-inner{
  height: 30px;
  
}
#background{
  display: flex;
}
.barchart-tag{
  margin-right:1em;
}
</style>