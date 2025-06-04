<script>
export default {
  name: "AmChartsComponent",
  data() {
    return {
      topRadius: 1,
      angle: 30,
      depth3D: 40,
      chart: null,
      chartData: [
        { country: "USA", visits: 4025, color: "#FF0F00" },
        { country: "China", visits: 1882, color: "#FF6600" },
        { country: "Japan", visits: 1809, color: "#FF9E01" },
        { country: "Germany", visits: 1322, color: "#FCD202" },
        { country: "UK", visits: 1122, color: "#F8FF01" },
        { country: "France", visits: 1114, color: "#B0DE09" },
        { country: "India", visits: 984, color: "#04D215" },
        { country: "Spain", visits: 711, color: "#0D8ECF" },
        { country: "Netherlands", visits: 665, color: "#0D52D1" },
        { country: "Russia", visits: 580, color: "#2A0CD0" },
        { country: "South Korea", visits: 443, color: "#8A0CCF" },
        { country: "Canada", visits: 441, color: "#CD0D74" },
        { country: "Brazil", visits: 395, color: "#754DEB" },
        { country: "Italy", visits: 386, color: "#DDDDDD" },
        { country: "Australia", visits: 384, color: "#999999" },
        { country: "Taiwan", visits: 338, color: "#333333" },
        { country: "Poland", visits: 328, color: "#000000" },
      ],
    };
  },
  mounted() {
    this.createChart();
  },
  watch: {
    topRadius(newVal) {
      this.updateChartProperty("topRadius", newVal);
    },
    angle(newVal) {
      this.updateChartProperty("angle", newVal);
    },
    depth3D(newVal) {
      this.updateChartProperty("depth3D", newVal);
    },
  },
  methods: {
    createChart() {
      this.chart = AmCharts.makeChart("chartdiv", {
        type: "serial",
        startDuration: 2,
        dataProvider: this.chartData,
        valueAxes: [
          {
            position: "left",
            axisAlpha: 0,
            gridAlpha: 0,
          },
        ],
        graphs: [
          {
            balloonText: "[[category]]: <b>[[value]]</b>",
            colorField: "color",
            fillAlphas: 0.85,
            lineAlpha: 0.1,
            type: "column",
            topRadius: this.topRadius,
            valueField: "visits",
          },
        ],
        depth3D: this.depth3D,
        angle: this.angle,
        chartCursor: {
          categoryBalloonEnabled: false,
          cursorAlpha: 0,
          zoomable: false,
        },
        categoryField: "country",
        categoryAxis: {
          gridPosition: "start",
          axisAlpha: 0,
          gridAlpha: 0,
        },
        exportConfig: {
          menuTop: "20px",
          menuRight: "20px",
          menuItems: [
            {
              icon: "/lib/3/images/export.png",
              format: "png",
            },
          ],
        },
      });
    },

    updateChartProperty(property, value) {
      if (this.chart) {
        this.chart.graphs[0][property] = value;
        this.chart[property] = value;
        this.chart.validateNow();
      }
    },
  },
};
</script><template>
  <div>
    <div id="chartdiv"></div>

    <div class="container-fluid">
      <div class="row justify-content-center control-row">
        <div class="control-item">
          <label for="topRadius">Top Radius:</label>
          <input class="chart-input" data-property="topRadius" type="range" min="0" max="1.5" v-model="topRadius" step="0.01" />
        </div>

        <div class="control-item">
          <label for="angle">Angle:</label>
          <input class="chart-input" data-property="angle" type="range" min="0" max="89" v-model="angle" step="1" />
        </div>

        <div class="control-item">
          <label for="depth3D">Depth:</label>
          <input class="chart-input" data-property="depth3D" type="range" min="1" max="120" v-model="depth3D" step="1" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#chartdiv {
  width: 100%;
  height: 435px;
  font-size: 11px;
}
.control-row {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap; 
  align-items: center;
  margin-top: 15px;
}

.control-item {
  text-align: center;
  flex: 1 1 150px;
  max-width: 180px;
}

.control-item label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 5px;
}

.chart-input {
  width: 100%;
  height: 20px;
  margin-top: 5px;
  border-radius: 4px;
  padding: 2px;
  font-size: 0.9rem;
}
</style>
