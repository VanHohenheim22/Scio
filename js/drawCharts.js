let xfilter = crossfilter()

let dim = {}
let grp = {}

dim.OAStartYear = xfilter.dimension(d => d["When did the journal start to publish all content using an open license?"])
grp.OAStartYear = dim.OAStartYear.group().reduceCount()

dim.institution = xfilter.dimension(d => d.Publisher)
grp.institution = dim.institution.group()

grp.docs = xfilter.groupAll().reduceSum(function(d) {
    return d["Number of Article Records"];
});

// Obtener el ancho y alto de la ventana del navegador
const widthventana = window.innerWidth;
const heightventana = window.innerHeight;

widthventana

// Establecer el ancho y alto del gráfico de barras

  const varWidth = widthventana * 0.78;
  const vartHeight = heightventana * 0.6;

  if (widthventana <= 640) {
    varWidth = widthventana * 1.2;
    vartHeight = heightventana * 0.4;
  }


//--------------------------------------------------------------

let barChart_TotalperYear = new dc.BarChart('#barChart_totalJournalsTiempo')
                                  .dimension(dim.OAStartYear)
                                  .group(grp.OAStartYear)
                                  .width(varWidth)
                                  .height(vartHeight)
                                  .brushOn(true)
                                  .x(d3.scaleLinear().domain([1950, 2024]))
                                  .colors(d3.scaleOrdinal().range(['#8275B0']))

barChart_TotalperYear.xAxis().ticks(10).tickFormat(d3.format('.0f'));


let divMenu_institutions = new DivMenu('#divMenu_Institucion')
    .dimension(dim.institution)
    .group(grp.institution)

let totalDocs =  dc.numberDisplay("#Total-articulos")
                      .html({
                        one:'%number artículo',
                        some:'%number artículos',
                        none:'no records'})
                      .group(grp.docs)
                      .valueAccessor(d=>d)
